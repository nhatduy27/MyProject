#define RAYGUI_IMPLEMENTATION
#include "game.h"


int main() {
    InitWindow(SCREEN_WIDTH, SCREEN_HEIGHT, "Snake Game by ND");
    SetTargetFPS(60); // Tăng FPS để menu mượt hơn
    SetExitKey(KEY_NULL); // tắt phím thoát của thư viện Raylib

    Game game;
    float lastUpdate = GetTime();
    

    while (!WindowShouldClose()) {
        game.HandleInput();

        if(game.shoudExit()) break;

        // Chỉ update game khi đang chơi
        if (game.GetState() == PLAYING && GetTime() - lastUpdate >= 1.0f / (BASE_FPS * game.GetSpeed())) {
            game.Update();
            lastUpdate = GetTime();
        }

        BeginDrawing();
            game.Draw();
        EndDrawing();
    }

    CloseWindow();
    return 0;
}