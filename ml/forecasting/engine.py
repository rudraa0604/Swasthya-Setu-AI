import math
from datetime import date, timedelta
from typing import List, Dict, Any, Optional

class DemandForecastingEngine:
    """
    Time-Series Demand Forecasting Engine for PHC Medicine Consumption.
    Predicts 7, 14, 30-day demand curves, stock-out date, and stock-out probabilities.
    Generates explainable rationale for every forecast.
    """

    def __init__(self):
        pass

    def forecast_medicine_demand(
        self,
        phc_id: str,
        phc_name: str,
        medicine_name: str,
        current_stock: int,
        buffer_threshold: int,
        daily_consumption_history: List[Dict[str, Any]],  # list of {"date": "YYYY-MM-DD", "quantity": int}
        footfall_history: Optional[List[Dict[str, Any]]] = None,
        forecast_horizon_days: int = 14
    ) -> Dict[str, Any]:
        """
        Generates demand forecast and stock-out trajectory.
        """
        if not daily_consumption_history:
            # Fallback when minimal data exists
            avg_daily = 10.0
            variance = 4.0
            trend = 0.0
            dow_factors = {i: 1.0 for i in range(7)}
        else:
            # Sort history chronologically
            sorted_history = sorted(daily_consumption_history, key=lambda x: str(x["date"]))
            values = [x["quantity"] for x in sorted_history]
            n = len(values)

            # 1. Base statistics
            recent_window = values[-14:] if n >= 14 else values
            avg_daily = sum(recent_window) / max(1, len(recent_window))
            
            # Variance
            if len(recent_window) > 1:
                variance = sum((v - avg_daily) ** 2 for v in recent_window) / (len(recent_window) - 1)
                std_dev = math.sqrt(variance)
            else:
                std_dev = avg_daily * 0.2

            # 2. Trend analysis (linear regression over last 14 days)
            if len(recent_window) >= 5:
                x_vals = list(range(len(recent_window)))
                x_mean = sum(x_vals) / len(x_vals)
                y_mean = avg_daily
                numerator = sum((x - x_mean) * (y - y_mean) for x, y in zip(x_vals, recent_window))
                denominator = sum((x - x_mean) ** 2 for x in x_vals)
                trend = (numerator / denominator) if denominator != 0 else 0.0
            else:
                trend = 0.0

            # 3. Day of week seasonality factors
            dow_sums = {i: [] for i in range(7)}
            for item in sorted_history:
                d_str = str(item["date"])
                try:
                    d_obj = date.fromisoformat(d_str) if isinstance(d_str, str) else item["date"]
                    dow_sums[d_obj.weekday()].append(item["quantity"])
                except Exception:
                    pass

            dow_factors = {}
            overall_mean = max(1.0, sum(values) / len(values))
            for i in range(7):
                if dow_sums[i]:
                    dow_factors[i] = (sum(dow_sums[i]) / len(dow_sums[i])) / overall_mean
                else:
                    dow_factors[i] = 1.0

        # Check for footfall / outbreak signal in recent footfall history
        outbreak_boost = 1.0
        outbreak_detected = False
        if footfall_history:
            recent_ff = [x.get("patient_count", 0) for x in footfall_history[-7:]]
            if recent_ff:
                ff_avg = sum(recent_ff) / len(recent_ff)
                if ff_avg > 110:  # Spike detection
                    outbreak_boost = min(2.5, 1.0 + (ff_avg - 110) / 100.0)
                    outbreak_detected = True

        # Generate future daily projections
        today = date.today()
        forecast_points = []
        cumulative_demand = 0.0
        running_stock = float(current_stock)
        days_to_stockout = 999.0
        stockout_date_str = None

        for step in range(1, forecast_horizon_days + 1):
            future_date = today + timedelta(days=step)
            dow = future_date.weekday()
            
            # Base projected consumption
            step_trend_effect = trend * step * 0.5  # Dampen trend projection
            projected_day_demand = max(1.0, (avg_daily + step_trend_effect) * dow_factors.get(dow, 1.0) * outbreak_boost)
            
            cumulative_demand += projected_day_demand
            running_stock = max(0.0, running_stock - projected_day_demand)
            
            # Record exact stock-out point
            if running_stock == 0 and days_to_stockout == 999.0:
                # Fractional day estimation
                prior_stock = current_stock - (cumulative_demand - projected_day_demand)
                fraction = prior_stock / projected_day_demand if projected_day_demand > 0 else 0
                days_to_stockout = round((step - 1) + max(0.1, min(0.99, fraction)), 1)
                stockout_date_str = future_date.isoformat()

            conf_margin = 1.96 * math.sqrt(step) * (avg_daily * 0.15)
            forecast_points.append({
                "date": future_date.isoformat(),
                "predicted_demand": round(projected_day_demand, 1),
                "projected_stock_level": round(running_stock, 1),
                "confidence_lower": round(max(0.0, projected_day_demand - conf_margin), 1),
                "confidence_upper": round(projected_day_demand + conf_margin, 1)
            })

        # Calculate Stock-Out Probability over the horizon
        # P(Stockout in horizon) = NormalCDF((CumulativeDemand - CurrentStock) / sqrt(Horizon * Var))
        total_std_dev = math.sqrt(forecast_horizon_days) * (avg_daily * 0.25)
        z_score = (cumulative_demand - current_stock) / max(0.001, total_std_dev)
        # Approximation of standard normal CDF: 0.5 * (1 + erf(z / sqrt(2)))
        prob_stockout = 0.5 * (1.0 + math.erf(z_score / math.sqrt(2.0)))
        prob_pct = round(max(0.0, min(100.0, prob_stockout * 100.0)), 1)

        # Classify Urgency Level
        if days_to_stockout <= 3.0 or (current_stock < buffer_threshold * 0.3):
            urgency = "Critical"
        elif days_to_stockout <= 7.0 or (current_stock < buffer_threshold):
            urgency = "Warning"
        else:
            urgency = "Healthy"

        # Generate Explainable Rationale
        daily_rate_est = round(avg_daily * outbreak_boost, 1)
        if urgency == "Critical":
            explanation = (
                f"CRITICAL: Stock-out imminent in {days_to_stockout} days ({prob_pct}% probability). "
                f"Current stock of {current_stock} units is severely below buffer threshold ({buffer_threshold}). "
                f"Daily burn rate is {daily_rate_est} units/day"
                + (f" amplified by active outbreak patient surge." if outbreak_detected else ".")
            )
        elif urgency == "Warning":
            explanation = (
                f"WARNING: Stock approaching critical threshold in {days_to_stockout} days. "
                f"Current stock is {current_stock} units vs buffer of {buffer_threshold} units. "
                f"Expected 7-day consumption is {round(daily_rate_est * 7, 0)} units."
            )
        else:
            days_str = f"{round(current_stock / max(1.0, daily_rate_est), 1)} days"
            explanation = (
                f"HEALTHY: Sufficient inventory covering approximately {days_str} of consumption. "
                f"Current stock: {current_stock} units (buffer: {buffer_threshold} units)."
            )

        return {
            "phc_id": phc_id,
            "phc_name": phc_name,
            "medicine_name": medicine_name,
            "current_stock": current_stock,
            "buffer_threshold": buffer_threshold,
            "daily_consumption_rate": daily_rate_est,
            "days_to_stockout": days_to_stockout if days_to_stockout != 999.0 else round(current_stock / max(0.1, daily_rate_est), 1),
            "stockout_date": stockout_date_str or (today + timedelta(days=int(current_stock / max(0.1, daily_rate_est)))).isoformat(),
            "stockout_probability_pct": prob_pct,
            "urgency_level": urgency,
            "forecast_horizon_days": forecast_horizon_days,
            "forecast_points": forecast_points,
            "explanation": explanation
        }

forecasting_engine = DemandForecastingEngine()
