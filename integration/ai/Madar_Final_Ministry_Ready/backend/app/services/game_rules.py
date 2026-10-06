from dataclasses import dataclass
from typing import Literal

CardType = Literal["know", "explore", "analyze"]

@dataclass(frozen=True)
class CardSpec:
    dok: int
    points: int
    steps: int
    color: str

CARD_SPECS = {
    "know": CardSpec(1, 1, 1, "green"),
    "explore": CardSpec(2, 2, 2, "yellow"),
    "analyze": CardSpec(3, 3, 3, "red"),
}
