from typing import Dict, Any, List

CATEGORY_KEYWORDS = {
    "Crowding": ["crowd", "packed", "full", "standing", "squeeze", "no room", "overflow", "rush hour", "jammed", "no space"],
    "Punctuality / Delay": ["late", "delay", "behind schedule", "wait", "waited", "cancelled", "never showed", "skip", "slow", "stuck", "schedule"],
    "Cleanliness": ["dirty", "filthy", "trash", "smell", "odor", "stain", "seat", "sticky", "garbage", "unclean", "litter"],
    "Driver Behaviour": ["driver", "rude", "reckless", "brake", "speeding", "yelled", "attitude", "phone", "texting", "skipped stop", "drove off"],
    "Service / Route Issue": ["route", "detour", "sign", "announcement", "card reader", "app", "ticket", "fare", "machine", "display"],
    "Safety": ["danger", "unsafe", "fight", "assault", "harass", "weapon", "scared", "dark", "emergency", "accident", "smoke", "threat"],
}

SEVERITY_KEYWORDS = {
    "Critical": ["dangerous", "injured", "threatened", "police", "assault", "weapon", "hospital", "fire", "emergency"],
    "High": ["horrible", "terrible", "extremely", "always", "worst", "unacceptable", "packed", "missed work", "angry", "skipped"],
    "Medium": ["bad", "annoying", "delayed", "dirty", "uncomfortable", "inconvenient"],
    "Low": ["slightly", "minor", "a bit", "could be better", "small issue"],
}

class ClassifierService:
    """
    Modular AI Feedback Classification Service.
    Integrates a rule-based NLP fallback engine with easy plug-in capability for Local LLMs (Ollama/Llama) or External AI APIs.
    """

    def classify_comment(self, comment: str, ratings: Dict[str, Any] = None) -> Dict[str, Any]:
        text = comment.lower().strip()
        if not text:
            return {
                "categories": ["Other"],
                "severity": "Low",
                "confidence": 0.70,
                "explanation": "No comment provided; default neutral fallback assigned."
            }

        category_scores: Dict[str, int] = {}
        detected_keywords: List[str] = []

        for category, keywords in CATEGORY_KEYWORDS.items():
            matches = [kw for kw in keywords if kw in text]
            if matches:
                category_scores[category] = len(matches)
                detected_keywords.extend(matches)

        # Sort categories by match count
        sorted_categories = sorted(category_scores.items(), key=lambda x: x[1], reverse=True)
        primary_category = sorted_categories[0][0] if sorted_categories else "Other"

        # Determine severity
        severity = "Medium"
        for sev, keywords in SEVERITY_KEYWORDS.items():
            if any(kw in text for kw in keywords):
                severity = sev
                break

        # Adjust severity based on rating if overall rating <= 2
        if ratings and ratings.get("overall"):
            if ratings["overall"] <= 1 and severity != "Critical":
                severity = "High"
            elif ratings["overall"] >= 4 and severity == "High":
                severity = "Medium"

        top_score = sorted_categories[0][1] if sorted_categories else 0
        confidence = min(0.82 + (top_score * 0.04), 0.98)

        categories = [primary_category]
        if len(sorted_categories) > 1 and sorted_categories[1][1] >= 1:
            categories.append(sorted_categories[1][0])

        explanation = f"Detected category '{primary_category}' with {severity} severity based on keywords: {detected_keywords}."

        return {
            "categories": categories,
            "severity": severity,
            "confidence": round(confidence, 2),
            "explanation": explanation
        }

classifier_service = ClassifierService()
