from decimal import Decimal

from app.repositories.bazi_repository import BaziRepository

HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]


def _gz(value: int) -> str:
    return f"{HEAVENLY_STEMS[value % len(HEAVENLY_STEMS)]}{EARTHLY_BRANCHES[value % len(EARTHLY_BRANCHES)]}"


class BaziService:
    def __init__(self, repository: BaziRepository | None = None) -> None:
        self.repository = repository or BaziRepository()

    def generate_from_user(self, db, *, user):
        birth = user.birth_datetime
        if birth is None:
            raise ValueError("birth_datetime is required")

        year_gz = _gz(birth.year)
        month_gz = _gz(birth.month + birth.year)
        day_gz = _gz(birth.day + birth.month)
        hour_gz = _gz((birth.hour or 0) + birth.day)

        feature_data = {
            "fiveElementsBias": {
                "wood": round(((birth.year % 5) + 1) / 10, 2),
                "fire": round(((birth.month % 5) + 1) / 10, 2),
                "earth": round(((birth.day % 5) + 1) / 10, 2),
                "metal": round((((birth.hour or 0) % 5) + 1) / 10, 2),
                "water": round((((birth.year + birth.month) % 5) + 1) / 10, 2),
            }
        }
        interpretation_data = {
            "summary": [
                "当前为占位八字分析结果",
                "后续阶段将替换为更完整的四柱与规则引擎",
            ],
            "dominantThemes": ["命盘初判", "待持续校准"],
        }
        score = min(60 + (birth.month % 12) + (birth.day % 20), 95)

        return self.repository.replace_current(
            db,
            user_id=user.id,
            year_gz=year_gz,
            month_gz=month_gz,
            day_gz=day_gz,
            hour_gz=hour_gz,
            chart_data={
                "yearGz": year_gz,
                "monthGz": month_gz,
                "dayGz": day_gz,
                "hourGz": hour_gz,
            },
            feature_data=feature_data,
            interpretation_data=interpretation_data,
            score=score,
            confidence=Decimal("0.6500"),
        )

    def get_current(self, db, *, user_id):
        return self.repository.get_current(db, user_id=user_id)

