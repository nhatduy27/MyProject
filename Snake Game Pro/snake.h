
#pragma one
#define RAYGUI_IMPLEMENTATION
#include <raylib.h>
#include <deque>
#include <vector>
#include <string>
#include <cmath>


#define DARK_GREEN     CLITERAL(Color){ 43, 51, 24, 255 }
#define LIGHT_GREEN    CLITERAL(Color){ 173, 204, 96, 255 }
#define DARK_RED       CLITERAL(Color){ 150, 20, 30, 255 }
#define GOLD_YELLOW    CLITERAL(Color){ 255, 203, 0, 255 }



const int CELL_SIZE = 35;
const int CELL_COUNT = 25;
const int SCREEN_WIDTH = CELL_SIZE * CELL_COUNT;
const int SCREEN_HEIGHT = CELL_SIZE * CELL_COUNT + 50;
const int BASE_FPS = 10;



struct Vector2Int {
    int x, y;
    bool operator==(const Vector2Int& other) const {
        return x == other.x && y == other.y;
    }
};

class Snake {
private:
    std::deque<Vector2Int> body;
    Vector2Int direction;
    Vector2Int nextDirection;
    bool addSegment;

public:
    Snake() : body{{5, 5}}, direction{1, 0}, nextDirection{1, 0}, addSegment(false) {}

    void Draw() {
        Rectangle head = {
            (float)(body.front().x * CELL_SIZE),
            (float)(body.front().y * CELL_SIZE + 50),
            (float)CELL_SIZE, (float)CELL_SIZE
        };
        DrawRectangleRounded(head, 0.7, 8, DARK_RED);

        for (size_t i = 1; i < body.size(); i++) {
            Rectangle segment = {
                (float)(body[i].x * CELL_SIZE),
                (float)(body[i].y * CELL_SIZE + 50),
                (float)CELL_SIZE, (float)CELL_SIZE
            };
            DrawRectangleRounded(segment, 0.5, 6, DARK_GREEN);
        }
    }

    void Update() {

        direction = nextDirection;
        Vector2Int newHead = {
            (body.front().x + direction.x + CELL_COUNT) % CELL_COUNT,
            (body.front().y + direction.y + CELL_COUNT) % CELL_COUNT
        };
        body.push_front(newHead);

        if (!addSegment) body.pop_back();
        else addSegment = false;
    }

    void ChangeDirection(Vector2Int newDir) {
        if (direction.x * newDir.x == 0 && direction.y * newDir.y == 0)
            nextDirection = newDir;
    }

    void Grow() { addSegment = true; }
    void Reset() {
        body = {{5, 5}, {5,4}, {5,3}};
        direction = nextDirection = {1, 0};
        addSegment = false;
    }

    Vector2Int GetHeadPosition() const { return body.front(); }

    bool CheckSelfCollision() const {
        for (size_t i = 1; i < body.size(); i++)
            if (body.front() == body[i]) return true;
        return false;
    }

    bool CheckPosition(Vector2Int pos) const {
        for (const auto& segment : body)
            if (segment == pos) return true;
        return false;
    }

    int GetLength() const { return body.size(); }
};