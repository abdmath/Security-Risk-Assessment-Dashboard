def calculate_risk_score(threats):
    total_risk = 0
    for threat in threats:
        total_risk += threat['likelihood'] * threat['impact']
    return round(total_risk / (len(threats) or 1), 2)

def classify_domains(controls, framework):
    scores = {"Identify": 0, "Protect": 0, "Detect": 0, "Respond": 0, "Recover": 0}
    for control in controls:
        for func in scores:
            if func.lower() in control['description'].lower():
                scores[func] += 1 if control['implemented'] else 0
    total = sum(scores.values()) or 1
    return {k: round((v / total) * 100, 2) for k, v in scores.items()}
