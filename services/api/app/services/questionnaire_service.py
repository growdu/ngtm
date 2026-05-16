from decimal import Decimal

from sqlalchemy.orm import Session

from app.repositories.intake_repository import IntakeRepository
from app.schemas.questionnaire import (
    QuestionnaireAnswerRequest,
    QuestionnaireQuestion,
)


# 问卷分批策略 - 每批返回的问题数
BATCH_SIZE = 3


# 问卷维度分组
QUESTION_GROUPS = [
    # 第一批：风险偏好与决策
    {
        "group": "risk",
        "label": "风险偏好与决策",
        "questions": [
            QuestionnaireQuestion(
                questionId="career-risk-preference",
                questionText="当你面对一个高收益但高不确定性的机会时，你通常会？",
                traitTargets=["riskPreference", "longTermOrientation"],
                options=["快速抓住机会", "观察一段时间后再决定", "只有非常确定才行动", "视情况而定"],
            ),
            QuestionnaireQuestion(
                questionId="investment-decision",
                questionText="你会把大部分储蓄用于高风险高回报投资吗？",
                traitTargets=["riskPreference", "wealthDrive"],
                options=["会，我享受高风险", "会，但会控制比例", "不会，我偏好稳健", "完全不会"],
            ),
            QuestionnaireQuestion(
                questionId="decision-basis",
                questionText="你做重大决定时主要依赖什么？",
                traitTargets=["rationality", "riskPreference"],
                options=["理性分析和数据", "直觉和经验", "听取他人意见", "看当时情绪"],
            ),
        ],
    },
    # 第二批：情绪稳定性
    {
        "group": "emotion",
        "label": "情绪与控制",
        "questions": [
            QuestionnaireQuestion(
                questionId="conflict-response",
                questionText="在高压冲突中，你更接近哪种反应？",
                traitTargets=["emotionStability", "controlDrive"],
                options=["先压住情绪再处理", "直接正面回应", "先回避，之后再处理", "视对象而定"],
            ),
            QuestionnaireQuestion(
                questionId="emotional-setback",
                questionText="遭遇重大挫折时，你通常需要多久恢复？",
                traitTargets=["emotionStability", "rationality"],
                options=["很快就能调整", "几天到一周", "需要较长时间", "很难走出来"],
            ),
            QuestionnaireQuestion(
                questionId="control-drive",
                questionText="当你觉得事情脱离掌控时，你会有什么感受？",
                traitTargets=["controlDrive", "emotionStability"],
                options=["非常焦虑", "有些不安", "无所谓", "反而觉得轻松"],
            ),
        ],
    },
    # 第三批：事业驱动
    {
        "group": "career",
        "label": "事业与野心",
        "questions": [
            QuestionnaireQuestion(
                questionId="career-drive",
                questionText="你每周工作时长通常是多少？",
                traitTargets=["careerDrive", "executionStrength"],
                options=["超过50小时", "40-50小时", "30-40小时", "不到30小时"],
            ),
            QuestionnaireQuestion(
                questionId="career-ambition",
                questionText="你对事业成功的定义是什么？",
                traitTargets=["careerDrive", "longTermOrientation"],
                options=["成为行业顶尖", "财务自由", "做自己喜欢的事", "平稳发展即可"],
            ),
            QuestionnaireQuestion(
                questionId="long-term-planning",
                questionText="你通常会为多久后的目标做规划？",
                traitTargets=["longTermOrientation", "careerDrive"],
                options=["10年以上", "3-10年", "1-3年", "只关注当下"],
            ),
        ],
    },
    # 第四批：执行与习惯
    {
        "group": "execution",
        "label": "执行与习惯",
        "questions": [
            QuestionnaireQuestion(
                questionId="execution-strength",
                questionText="你完成计划的习惯是？",
                traitTargets=["executionStrength", "longTermOrientation"],
                options=["提前完成", "按时完成", "经常拖延", "经常半途而废"],
            ),
            QuestionnaireQuestion(
                questionId="procrastination",
                questionText="面对不想做但必须做的事，你会？",
                traitTargets=["executionStrength", "emotionStability"],
                options=["立刻去做", "尽快开始", "拖到最后", "能不做就不做"],
            ),
            QuestionnaireQuestion(
                questionId="delegation",
                questionText="你更倾向于亲自监督还是授权他人？",
                traitTargets=["controlDrive", "relationshipDependency"],
                options=["必须亲自监督", "主要亲自监督", "适当授权", "充分放权"],
            ),
        ],
    },
    # 第五批：人际关系
    {
        "group": "relationship",
        "label": "人际关系",
        "questions": [
            QuestionnaireQuestion(
                questionId="relationship-dependency",
                questionText="你更享受独处还是社交？",
                traitTargets=["relationshipDependency", "introversion"],
                options=["更喜欢独处", "偏向独处", "偏向社交", "非常喜欢社交"],
            ),
            QuestionnaireQuestion(
                questionId="social-energy",
                questionText="在社交场合中，你通常是？",
                traitTargets=["relationshipDependency", "emotionStability"],
                options=["主导者", "积极参与者", "被动参与者", "尽量不参与"],
            ),
        ],
    },
    # 第六批：财富观
    {
        "group": "wealth",
        "label": "财富观念",
        "questions": [
            QuestionnaireQuestion(
                questionId="wealth-drive",
                questionText="你对财富的态度是？",
                traitTargets=["wealthDrive", "riskPreference"],
                options=["越多越好，不断追求", "够用就行，追求平衡", "够生活就好", "财富不重要"],
            ),
            QuestionnaireQuestion(
                questionId="delayed-gratification",
                questionText="你能否为了长期目标放弃即时满足？",
                traitTargets=["longTermOrientation", "riskPreference"],
                options=["完全可以", "大多数时候可以", "偶尔可以", "几乎不行"],
            ),
            QuestionnaireQuestion(
                questionId="logic-vs-emotion",
                questionText="你认为自己更偏向？",
                traitTargets=["rationality", "emotionStability"],
                options=["极度理性", "比较理性", "比较感性", "极度感性"],
            ),
        ],
    },
]


class QuestionnaireService:
    def __init__(self, repository: IntakeRepository | None = None) -> None:
        self.repository = repository or IntakeRepository()
        self._group_index = 0  # 当前组索引

    def get_next_questions(self, batch_size: int = BATCH_SIZE) -> list[QuestionnaireQuestion]:
        """
        分批返回问卷问题

        每批返回指定数量的问题，按组轮询
        """
        all_questions: list[QuestionnaireQuestion] = []

        # 收集还未返回完的组的问题
        groups_to_process = len(QUESTION_GROUPS)
        questions_collected = 0

        while questions_collected < batch_size and groups_to_process > 0:
            group = QUESTION_GROUPS[self._group_index % len(QUESTION_GROUPS)]
            remaining_in_group = len(group["questions"])

            if remaining_in_group > 0:
                questions_to_add = min(batch_size - questions_collected, remaining_in_group)
                all_questions.extend(group["questions"][:questions_to_add])
                questions_collected += questions_to_add

            self._group_index += 1
            groups_to_process -= 1

        return all_questions

    def get_total_progress(self) -> dict:
        """获取问卷总进度信息"""
        return {
            "totalGroups": len(QUESTION_GROUPS),
            "totalQuestions": sum(len(g["questions"]) for g in QUESTION_GROUPS),
            "groups": [
                {"group": g["group"], "label": g["label"], "count": len(g["questions"])}
                for g in QUESTION_GROUPS
            ],
        }

    def reset_progress(self) -> None:
        """重置问卷进度"""
        self._group_index = 0

    def save_answers(self, db: Session, *, user_id, payload: QuestionnaireAnswerRequest) -> None:
        for answer in payload.answers:
            self.repository.create_record(
                db,
                user_id=user_id,
                intake_type="questionnaire_answer",
                source_channel="web",
                payload=answer.model_dump(mode="json"),
                confidence=Decimal("0.8000"),
            )

