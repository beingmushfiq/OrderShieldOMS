<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OrderShield OMS Backend</title>
    <style>
        body {
            font-family: 'Inter', system-ui, sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            text-align: center;
        }
        .container {
            background: white;
            padding: 3rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            max-width: 500px;
        }
        h1 {
            color: #2563eb;
            margin-top: 0;
            margin-bottom: 1rem;
        }
        p {
            color: #475569;
            line-height: 1.5;
            margin: 0;
        }
        .status {
            display: inline-block;
            margin-top: 1.5rem;
            padding: 0.5rem 1rem;
            background-color: #dcfce7;
            color: #166534;
            border-radius: 9999px;
            font-weight: 500;
            font-size: 0.875rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>OrderShield OMS</h1>
        <p>Backend API Service is running successfully.</p>
        <div class="status">System Status: Online</div>
    </div>
</body>
</html>
