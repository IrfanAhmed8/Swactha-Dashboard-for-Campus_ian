def check_alert(people_count, garbage_count):

    # CONFIG (you can tune later)
    HIGH_PEOPLE = 10
    LOW_PEOPLE = 3
    HIGH_GARBAGE = 3

    # 🔴 Critical condition
    if people_count >= HIGH_PEOPLE and garbage_count >= HIGH_GARBAGE:
        return {
            "type": "CRITICAL",
            "icon": "🔴",
            "message": "High crowd & high garbage detected"
        }

    # 🟠 Warning condition
    elif people_count <= LOW_PEOPLE and garbage_count >= HIGH_GARBAGE:
        return {
            "type": "WARNING",
            "icon": "🟠",
            "message": "Low crowd but high garbage detected"
        }

    # No alert
    return None