import sys
import json
import numpy as np
import pandas as pd
import requests
from sklearn.ensemble import RandomForestRegressor

# Step 1: Fetch historical NASA POWER data for a location
def get_nasa_data(lat, lon, start="20230101", end="20231231"):
    url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    params = {
        "latitude": lat,
        "longitude": lon,
        "start": start,
        "end": end,
        "parameters": "T2M,PRECTOTCORR,PS",
        "community": "RE",
        "format": "JSON"
    }

    res = requests.get(url, params=params)
    data = res.json().get("properties", {}).get("parameter", {})

    if not data:
        raise Exception("NASA API returned no data")

    df = pd.DataFrame({
        "temperature": list(data["T2M"].values()),
        "precipitation": list(data["PRECTOTCORR"].values()),
        "pressure": list(data["PS"].values())
    })

    # Simulate AQI, population, industry
    df["aqi"] = df["precipitation"] * 1.5 + 40  # estimated AQI
    df["population"] = 1000                     # assumed static
    df["industry"] = np.where(df["pressure"] > 1010, 8, 5)

    # Simulated risk score (label)
    df["risk_score"] = (df["temperature"] * 0.1 + df["aqi"] * 0.15 + df["industry"] * 0.5).astype(int)

    return df

# Step 2: Load coordinates and run training + prediction
try:
    # Example input: { "lat": 28.6, "lon": 77.2 }
    input_json = json.loads(sys.argv[1])
    lat = input_json["lat"]
    lon = input_json["lon"]

    df = get_nasa_data(lat, lon)

    # Train model with dynamic data
    X_train = df[["temperature", "aqi", "population", "industry"]]
    y_train = df["risk_score"]

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Predict using latest record
    latest_input = X_train.iloc[-1].values.reshape(1, -1)
    pred = model.predict(latest_input)

    print(json.dumps({
        "risk_score": int(pred[0]),
        "features": latest_input.tolist()[0]
    }))

except Exception as e:
    print(json.dumps({ "error": str(e) }))
