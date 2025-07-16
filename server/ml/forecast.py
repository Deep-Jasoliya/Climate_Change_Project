import sys
import json
import numpy as np
from sklearn.linear_model import LinearRegression

try:
    data = json.loads(sys.argv[1])
    X = np.array(range(len(data))).reshape(-1, 1)
    y = np.array(data)

    model = LinearRegression().fit(X, y)
    future = np.array([[len(data) + i] for i in range(1, 6)])
    pred = model.predict(future)

    result = [round(x, 2) for x in pred]
    print(json.dumps(result))

except Exception as e:
    print(json.dumps({"error": str(e)}))
