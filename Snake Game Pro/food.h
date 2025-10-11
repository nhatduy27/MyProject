#pragma one
#include "snake.h"

class Food {
private:
    Vector2Int position;
    bool isSpecial;
    float spawnTime;
    float duration;

public:
    Food() : isSpecial(false), spawnTime(0), duration(10) {
        Respawn({}, false);
    }

    void Respawn(const Snake& snake, bool special) {
        isSpecial = special;
        if (isSpecial) {
            spawnTime = GetTime();
            duration = 5 + GetRandomValue(0, 5);
        }

        int attempts = 100;
        do {
            position = {
                GetRandomValue(0, CELL_COUNT - 1),
                GetRandomValue(0, CELL_COUNT - 1)
            };
        } while (snake.CheckPosition(position) && --attempts > 0);
    }

    void Draw() {
        if (isSpecial) {
            float timeLeft = spawnTime + duration - GetTime();
            float pulse = sin(GetTime() * 5) * 0.2f + 0.8f;

            if (timeLeft > 0) {
                Color c = GOLD;
                c.a = 255 * pulse;
                DrawRectangle(position.x * CELL_SIZE, position.y * CELL_SIZE + 50, CELL_SIZE, CELL_SIZE, c);
            }
        } else {
            DrawRectangle(position.x * CELL_SIZE, position.y * CELL_SIZE + 50, CELL_SIZE, CELL_SIZE, RED);
        }
    }

    bool CheckTimeOut() const {
        return isSpecial && (GetTime() > spawnTime + duration);
    }

    Vector2Int GetPosition() const { return position; }
    bool IsSpecial() const { return isSpecial; }
};
