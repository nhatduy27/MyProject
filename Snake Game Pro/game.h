#pragma once
#include "food.h"
#include <fstream>
#include <vector>

// Trạng thái game
enum GameState {
    MENU,
    PLAYING,
    GAME_OVER,
    PAUSED,
    LOGIN,         
    REGISTER
};

//struct định nghĩa những thành phần của một tài khoản User

struct User {
    std::string username;
    std::string password;
    int highScore;
};


//Các thành phần của một màn hình giao diện đăng nhập

struct LoginScreen {
    Rectangle usernameBox;
    Rectangle passwordBox;
    Rectangle loginButton;
    Rectangle registerButton;
    Rectangle backButton;
    std::string usernameInput;    
    std::string passwordInput;   
    bool usernameActive = false;
    bool passwordActive = false;
    std::string errorMessage;
};

struct Menu{
    Rectangle playButton;
    Rectangle exitButton; 
    Rectangle logoutButton; 
};
struct Pause{
    Rectangle continuePlay;
    Rectangle exitGame;
};

class Game {
private:
    bool ExitGame;
    Snake snake;
    Food food;
    Food specialFood;
    int score;
    int highScore;
    bool gameOver;
    bool paused;
    float speed;
    Sound eatSound{};
    Sound crashSound{};
    GameState currentState;
    LoginScreen loginScreen;     
    std::vector<User> users;      
    User currentUser;  
    Menu menu;
    Pause pause;
    bool isLoggedIn; 
    
public:
    Game() : score(0), gameOver(false), paused(false), speed(1.0f), isLoggedIn(false) {
        InitAudioDevice();
        if (FileExists("resources/eat.wav")) eatSound = LoadSound("resources/eat.wav");
        if (FileExists("resources/crash.wav")) crashSound = LoadSound("resources/crash.wav");
        food.Respawn(snake, false);
        ExitGame = false;
        readHighScoreFromFile();
        
        menu.playButton = { SCREEN_WIDTH/2 - 100, SCREEN_HEIGHT/2 - 50, 200, 50 };
        menu.exitButton = { SCREEN_WIDTH/2 - 100, SCREEN_HEIGHT/2 + 20, 200, 50 };
        menu.logoutButton = { SCREEN_WIDTH/2 - 100, SCREEN_HEIGHT/2 + 90, 200, 50 };
        
        pause.continuePlay = { SCREEN_WIDTH/2 - 100, SCREEN_HEIGHT/2 - 100 , 200, 50 };
        pause.exitGame = { SCREEN_WIDTH/2 - 100, SCREEN_HEIGHT/2 - 30 , 200, 50 };

        loginScreen.usernameBox = { SCREEN_WIDTH/2 - 150, SCREEN_HEIGHT/2 - 80, 300, 40 };
        loginScreen.passwordBox = { SCREEN_WIDTH/2 - 150, SCREEN_HEIGHT/2 - 20, 300, 40 };
        loginScreen.loginButton = { SCREEN_WIDTH/2 - 150, SCREEN_HEIGHT/2 + 40, 140, 40 };
        loginScreen.registerButton = { SCREEN_WIDTH/2 + 10, SCREEN_HEIGHT/2 + 40, 140, 40 };
        loginScreen.backButton = { 20, 20, 80, 30 };
        
        LoadUsersFromFile();
        currentState = LOGIN; 
    }

    ~Game() {
        UnloadSound(eatSound);
        UnloadSound(crashSound);
        CloseAudioDevice();
    }

    void Update() {
        if (currentState != PLAYING) return;
    
        snake.Update();
        
        if (snake.GetHeadPosition() == food.GetPosition()) {
            PlaySound(eatSound);
            snake.Grow();
            score += 10;
            food.Respawn(snake, false);

            if (GetRandomValue(0, 4) == 0 && !specialFood.IsSpecial())
                specialFood.Respawn(snake, true);
        }

        if (specialFood.IsSpecial() && snake.GetHeadPosition() == specialFood.GetPosition()) {
            PlaySound(eatSound);
            snake.Grow();
            score += 50;
            specialFood.Respawn(snake, false);
            speed = 2.0f + (float)(score / 100) * 0.2f;
        }

        if (specialFood.IsSpecial() && specialFood.CheckTimeOut()) {
            specialFood.Respawn(snake, false);
        }

        if (snake.CheckSelfCollision()) {
            PlaySound(crashSound);
            currentState = GAME_OVER;
            if (score > highScore) highScore = score;
        }
        speed = 1.0f + (float)(score / 100) * 0.2f;
        if (score > currentUser.highScore) {
            currentUser.highScore = score;
            
            for (auto& user : users) {
                if (user.username == currentUser.username) {
                    user.highScore = currentUser.highScore;
                    break;
                }
            }
            
            SaveUsersToFile();
        }
    }

    void DrawMenu() {
        ClearBackground(DARK_GREEN);
        
        // Vẽ tiêu đề game
        DrawText("SNAKE GAME", SCREEN_WIDTH/2 - MeasureText("SNAKE GAME", 50)/2, 100, 50, GOLD_YELLOW);
        
        // Hiển thị thông tin user
        DrawText(TextFormat("Welcome, %s", currentUser.username.c_str()), 20, 20, 20, WHITE);
        DrawText(TextFormat("High Score: %d", currentUser.highScore), 20, 50, 20, WHITE);
        
        // Vẽ nút "Chơi ngay"
        DrawRectangleRec(menu.playButton, BLUE);
        DrawRectangleLinesEx(menu.playButton, 3, BLACK);
        DrawText("PLAY NOW", menu.playButton.x + menu.playButton.width/2 - MeasureText("PLAY NOW", 30)/2, 
                menu.playButton.y + menu.playButton.height/2 - 15, 30, WHITE);
        
        // Vẽ nút "Thoát game"
        DrawRectangleRec(menu.exitButton, RED);
        DrawRectangleLinesEx(menu.exitButton, 3, BLACK);
        DrawText("EXIT GAME", 
                menu.exitButton.x + menu.exitButton.width/2 - MeasureText("EXIT GAME", 30)/2, 
                menu.exitButton.y + menu.exitButton.height/2 - 15, 
                30, WHITE);
        
        // Vẽ nút "Đăng xuất"
        DrawRectangleRec(menu.logoutButton, ORANGE);
        DrawRectangleLinesEx(menu.logoutButton, 3, BLACK);
        DrawText("LOGOUT", 
                menu.logoutButton.x + menu.logoutButton.width/2 - MeasureText("LOGOUT", 30)/2, 
                menu.logoutButton.y + menu.logoutButton.height/2 - 15, 
                30, WHITE);
        
        // Vẽ hướng dẫn
        DrawText("Use arrow keys to move", SCREEN_WIDTH/2 - MeasureText("Use arrow keys to move", 20)/2, 
                SCREEN_HEIGHT - 100, 20, LIGHT_GREEN);
        DrawText("Press P to pause", SCREEN_WIDTH/2 - MeasureText("Press P to pause", 20)/2, 
                SCREEN_HEIGHT - 70, 20, LIGHT_GREEN);
    }

    void DrawLoginScreen() {
        ClearBackground(DARK_GREEN);
        
        // Tiêu đề
        DrawText("LOGIN", SCREEN_WIDTH/2 - MeasureText("LOGIN", 40)/2, 100, 40, GOLD_YELLOW);
        
        // Ô username
        DrawRectangleRec(loginScreen.usernameBox, loginScreen.usernameActive ? LIGHTGRAY : GRAY);
        DrawRectangleLinesEx(loginScreen.usernameBox, 2, DARK_GREEN);
        DrawText("Username:", loginScreen.usernameBox.x - 100, loginScreen.usernameBox.y + 10, 20, WHITE);
        DrawText(loginScreen.usernameInput.c_str(), loginScreen.usernameBox.x + 10, loginScreen.usernameBox.y + 10, 20, BLACK);
        
        // Ô password
        DrawRectangleRec(loginScreen.passwordBox, loginScreen.passwordActive ? LIGHTGRAY : GRAY);
        DrawRectangleLinesEx(loginScreen.passwordBox, 2, DARK_GREEN);
        DrawText("Password:", loginScreen.passwordBox.x - 100, loginScreen.passwordBox.y + 10, 20, WHITE);
        
        std::string hiddenPassword(loginScreen.passwordInput.size(), '*');
        DrawText(hiddenPassword.c_str(), loginScreen.passwordBox.x + 10, loginScreen.passwordBox.y + 10, 20, BLACK);
        
        // Nút đăng nhập
        DrawRectangleRec(loginScreen.loginButton, BLUE);
        DrawText("Login", loginScreen.loginButton.x + 40, loginScreen.loginButton.y + 10, 20, WHITE);
        
        // Nút đăng ký
        DrawRectangleRec(loginScreen.registerButton, GREEN);
        DrawText("Register", loginScreen.registerButton.x + 30, loginScreen.registerButton.y + 10, 20, WHITE);
        
        // Hiển thị thông báo lỗi
        if (!loginScreen.errorMessage.empty()) {
            DrawText(loginScreen.errorMessage.c_str(), SCREEN_WIDTH/2 - MeasureText(loginScreen.errorMessage.c_str(), 20)/2, 
                    SCREEN_HEIGHT/2 + 100, 20, RED);
        }
        
        // Hiển thị trạng thái nhập
        if (loginScreen.usernameActive) {
            DrawText("|", loginScreen.usernameBox.x + 10 + MeasureText(loginScreen.usernameInput.c_str(), 20), 
                    loginScreen.usernameBox.y + 10, 20, BLACK);
        }
        if (loginScreen.passwordActive) {
            DrawText("|", loginScreen.passwordBox.x + 10 + MeasureText(hiddenPassword.c_str(), 20), 
                    loginScreen.passwordBox.y + 10, 20, BLACK);
        }
        
        // Hướng dẫn
        DrawText("Press TAB to switch between fields", SCREEN_WIDTH/2 - MeasureText("Press TAB to switch between fields", 15)/2, 
                SCREEN_HEIGHT - 50, 15, LIGHTGRAY);
        DrawText("Press ESC to cancel input", SCREEN_WIDTH/2 - MeasureText("Press ESC to cancel input", 15)/2, 
                SCREEN_HEIGHT - 30, 15, LIGHTGRAY);
    }

    void DrawRegisterScreen() {
        ClearBackground(DARK_GREEN);
        
        // Tiêu đề
        DrawText("REGISTER", SCREEN_WIDTH/2 - MeasureText("REGISTER", 40)/2, 100, 40, GOLD_YELLOW);
        
        // Ô username
        DrawRectangleRec(loginScreen.usernameBox, loginScreen.usernameActive ? LIGHTGRAY : GRAY);
        DrawRectangleLinesEx(loginScreen.usernameBox, 2, DARK_GREEN);
        DrawText("Username:", loginScreen.usernameBox.x - 100, loginScreen.usernameBox.y + 10, 20, WHITE);
        DrawText(loginScreen.usernameInput.c_str(), loginScreen.usernameBox.x + 10, loginScreen.usernameBox.y + 10, 20, BLACK);
        
        // Ô password
        DrawRectangleRec(loginScreen.passwordBox, loginScreen.passwordActive ? LIGHTGRAY : GRAY);
        DrawRectangleLinesEx(loginScreen.passwordBox, 2, DARK_GREEN);
        DrawText("Password:", loginScreen.passwordBox.x - 100, loginScreen.passwordBox.y + 10, 20, WHITE);
        
        std::string hiddenPassword(loginScreen.passwordInput.size(), '*');
        DrawText(hiddenPassword.c_str(), loginScreen.passwordBox.x + 10, loginScreen.passwordBox.y + 10, 20, BLACK);
        
        // Nút đăng ký
        DrawRectangleRec(loginScreen.loginButton, GREEN);
        DrawText("Register", loginScreen.loginButton.x + 30, loginScreen.loginButton.y + 10, 20, WHITE);
        
        // Nút back
        DrawRectangleRec(loginScreen.backButton, RED);
        DrawText("Back", loginScreen.backButton.x + 15, loginScreen.backButton.y + 5, 20, WHITE);
        
        // Hiển thị thông báo lỗi
        if (!loginScreen.errorMessage.empty()) {
            DrawText(loginScreen.errorMessage.c_str(), SCREEN_WIDTH/2 - MeasureText(loginScreen.errorMessage.c_str(), 20)/2, 
                    SCREEN_HEIGHT/2 + 100, 20, RED);
        }
    }

    void HandleLoginInput() {
        if (IsMouseButtonPressed(MOUSE_LEFT_BUTTON)) {
            Vector2 mousePos = GetMousePosition();
            
            if (CheckCollisionPointRec(mousePos, loginScreen.usernameBox)) {
                loginScreen.usernameActive = true;
                loginScreen.passwordActive = false;
                loginScreen.errorMessage.clear();
            }
            else if (CheckCollisionPointRec(mousePos, loginScreen.passwordBox)) {
                loginScreen.usernameActive = false;
                loginScreen.passwordActive = true;
                loginScreen.errorMessage.clear();
            }
            else if (CheckCollisionPointRec(mousePos, loginScreen.loginButton)) {
                if (ValidateUser(loginScreen.usernameInput, loginScreen.passwordInput)) {
                    isLoggedIn = true;
                    currentState = MENU;
                    highScore = currentUser.highScore;
                    loginScreen.errorMessage.clear();
                } else {
                    loginScreen.errorMessage = "Invalid username or password!";
                }
            }
            else if (CheckCollisionPointRec(mousePos, loginScreen.registerButton)) {
                currentState = REGISTER;
                loginScreen.errorMessage.clear();
                ResetLoginInput();
            }
        }
        
        if (IsKeyPressed(KEY_TAB)) {
            loginScreen.usernameActive = !loginScreen.usernameActive;
            loginScreen.passwordActive = !loginScreen.passwordActive;
            loginScreen.errorMessage.clear();
        }
        
        if (loginScreen.usernameActive) {
            int key = GetCharPressed();
            while (key > 0) {
                if ((key >= 32 && key <= 126) && loginScreen.usernameInput.length() < 20) {
                    loginScreen.usernameInput += (char)key;
                }
                key = GetCharPressed();
            }
            
            if (IsKeyPressed(KEY_BACKSPACE) && !loginScreen.usernameInput.empty()) {
                loginScreen.usernameInput.pop_back();
            }
        }
        
        if (loginScreen.passwordActive) {
            int key = GetCharPressed();
            while (key > 0) {
                if ((key >= 32 && key <= 126) && loginScreen.passwordInput.length() < 20) {
                    loginScreen.passwordInput += (char)key;
                }
                key = GetCharPressed();
            }
            
            if (IsKeyPressed(KEY_BACKSPACE) && !loginScreen.passwordInput.empty()) {
                loginScreen.passwordInput.pop_back();
            }
        }
        
        if (IsKeyPressed(KEY_ESCAPE)) {
            loginScreen.usernameActive = false;
            loginScreen.passwordActive = false;
        }
        
        // Enter để login
        if (IsKeyPressed(KEY_ENTER)) {
            if (ValidateUser(loginScreen.usernameInput, loginScreen.passwordInput)) {
                isLoggedIn = true;
                currentState = MENU;
                highScore = currentUser.highScore;
                loginScreen.errorMessage.clear();
            } else {
                loginScreen.errorMessage = "Invalid username or password!";
            }
        }
    }

    void HandleRegisterInput() {
        if (IsMouseButtonPressed(MOUSE_LEFT_BUTTON)) {
            Vector2 mousePos = GetMousePosition();
            
            if (CheckCollisionPointRec(mousePos, loginScreen.usernameBox)) {
                loginScreen.usernameActive = true;
                loginScreen.passwordActive = false;
                loginScreen.errorMessage.clear();
            }
            else if (CheckCollisionPointRec(mousePos, loginScreen.passwordBox)) {
                loginScreen.usernameActive = false;
                loginScreen.passwordActive = true;
                loginScreen.errorMessage.clear();
            }
            else if (CheckCollisionPointRec(mousePos, loginScreen.loginButton)) {
                if (RegisterUser(loginScreen.usernameInput, loginScreen.passwordInput)) {
                    isLoggedIn = true;
                    currentState = MENU;
                    highScore = currentUser.highScore;
                    loginScreen.errorMessage.clear();
                } else {
                    loginScreen.errorMessage = "Registration failed! Username may already exist or invalid credentials.";
                }
            }
            else if (CheckCollisionPointRec(mousePos, loginScreen.backButton)) {
                currentState = LOGIN;
                loginScreen.errorMessage.clear();
                ResetLoginInput();
            }
        }
        
        if (IsKeyPressed(KEY_TAB)) {
            loginScreen.usernameActive = !loginScreen.usernameActive;
            loginScreen.passwordActive = !loginScreen.passwordActive;
            loginScreen.errorMessage.clear();
        }
        
        if (loginScreen.usernameActive) {
            int key = GetCharPressed();
            while (key > 0) {
                if ((key >= 32 && key <= 126) && loginScreen.usernameInput.length() < 20) {
                    loginScreen.usernameInput += (char)key;
                }
                key = GetCharPressed();
            }
            
            if (IsKeyPressed(KEY_BACKSPACE) && !loginScreen.usernameInput.empty()) {
                loginScreen.usernameInput.pop_back();
            }
        }
        
        if (loginScreen.passwordActive) {
            int key = GetCharPressed();
            while (key > 0) {
                if ((key >= 32 && key <= 126) && loginScreen.passwordInput.length() < 20) {
                    loginScreen.passwordInput += (char)key;
                }
                key = GetCharPressed();
            }
            
            if (IsKeyPressed(KEY_BACKSPACE) && !loginScreen.passwordInput.empty()) {
                loginScreen.passwordInput.pop_back();
            }
        }
        
        if (IsKeyPressed(KEY_ESCAPE)) {
            loginScreen.usernameActive = false;
            loginScreen.passwordActive = false;
        }
        
        // Enter để register
        if (IsKeyPressed(KEY_ENTER)) {
            if (RegisterUser(loginScreen.usernameInput, loginScreen.passwordInput)) {
                isLoggedIn = true;
                currentState = MENU;
                highScore = currentUser.highScore;
                loginScreen.errorMessage.clear();
            } else {
                loginScreen.errorMessage = "Registration failed! Username may already exist or invalid credentials.";
            }
        }
    }

    bool ValidateUser(const std::string& username, const std::string& password) {
        for (const auto& user : users) {
            if (user.username == username && user.password == password) {
                currentUser = user;
                return true;
            }
        }
        return false;
    }

    bool RegisterUser(const std::string& username, const std::string& password) {
        // Kiểm tra username đã tồn tại
        for (const auto& user : users) {
            if (user.username == username) {
                return false;
            }
        }
        
        // Kiểm tra độ dài
        if (username.empty() || password.empty() || username.length() < 3 || password.length() < 4) {
            return false;
        }
        
        User newUser;
        newUser.username = username;
        newUser.password = password;
        newUser.highScore = 0;
        
        users.push_back(newUser);
        currentUser = newUser;
        
        SaveUsersToFile();
        return true;
    }

    void SaveUsersToFile() {
        std::ofstream file("users.dat");
        for (const auto& user : users) {
            file << user.username << "," << user.password << "," << user.highScore << "\n";
        }
        file.close();
    }

    void LoadUsersFromFile() {
        std::ifstream file("users.dat");
        if (!file) return;
        
        users.clear();
        std::string line;
        while (std::getline(file, line)) {
            size_t pos1 = line.find(',');
            size_t pos2 = line.find(',', pos1 + 1);
            
            if (pos1 != std::string::npos && pos2 != std::string::npos) {
                User user;
                user.username = line.substr(0, pos1);
                user.password = line.substr(pos1 + 1, pos2 - pos1 - 1);
                user.highScore = std::stoi(line.substr(pos2 + 1));
                
                users.push_back(user);
            }
        }
        file.close();
    }

    void ResetLoginInput() {
        loginScreen.usernameInput.clear();
        loginScreen.passwordInput.clear();
        loginScreen.usernameActive = false;
        loginScreen.passwordActive = false;
        loginScreen.errorMessage.clear();
    }

    void Draw() {
        if (currentState == MENU && isLoggedIn) {
            DrawMenu();
            return;
        }
        else if (currentState == LOGIN) { 
            DrawLoginScreen();
            return;
        }
        else if (currentState == REGISTER) {
            DrawRegisterScreen();
            return;
        }
        
        // Các trạng thái khác (PLAYING, GAME_OVER, PAUSED)
        ClearBackground(LIGHT_GREEN);

        for (int i = 0; i < CELL_COUNT; i++) {
            DrawLine(i * CELL_SIZE, 50, i * CELL_SIZE, SCREEN_HEIGHT, DARK_GREEN);
            DrawLine(0, 50 + i * CELL_SIZE, SCREEN_WIDTH, 50 + i * CELL_SIZE, DARK_GREEN);
        }

        DrawRectangle(0, 0, SCREEN_WIDTH, 50, DARK_GREEN);
        DrawText(TextFormat("Score: %d", score), 10, 15, 20, WHITE);
        DrawText(TextFormat("High Score: %d", highScore), SCREEN_WIDTH - 200, 15, 20, WHITE);

        snake.Draw();
        food.Draw();
        if (specialFood.IsSpecial()) specialFood.Draw();

        if (currentState == GAME_OVER) {
            DrawRectangle(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, {0, 0, 0, 150});
            DrawText("GAME OVER", SCREEN_WIDTH/2 - MeasureText("GAME OVER", 40)/2 + 15, SCREEN_HEIGHT/2 - 50, 40, RED);
            DrawText(TextFormat("Final Score: %d", score), SCREEN_WIDTH/2 - 100, SCREEN_HEIGHT/2, 30, WHITE);
            DrawText("Press SPACE to return to menu", SCREEN_WIDTH/2 - 150, SCREEN_HEIGHT/2 + 50, 20, WHITE);
            DrawText("Press A to play again", SCREEN_WIDTH/2 - 100, SCREEN_HEIGHT/2 + 80, 20, WHITE);
        } else if (currentState == PAUSED) {
            DrawRectangle(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, {0, 0, 0, 150});
            DrawText("PAUSED", SCREEN_WIDTH/2 - MeasureText("PAUSED", 40)/2, SCREEN_HEIGHT/3 - 20, 40, WHITE);
            
            DrawRectangleRec(pause.continuePlay, BLUE);
            DrawText("CONTINUE", 
                    pause.continuePlay.x + (pause.continuePlay.width - MeasureText("CONTINUE", 20)) / 2,
                    pause.continuePlay.y + 15, 
                    20, WHITE);
            
            DrawRectangleRec(pause.exitGame, RED);
            DrawText("EXIT GAME", 
                    pause.exitGame.x + (pause.exitGame.width - MeasureText("EXIT GAME", 20)) / 2,
                    pause.exitGame.y + 15, 
                    20, WHITE);
        }
    }

    void HandleInput() {
        if (currentState == LOGIN) {
            HandleLoginInput();
        }
        else if (currentState == REGISTER) {
            HandleRegisterInput();
        }
        else if (currentState == MENU && isLoggedIn) {
            if (IsMouseButtonPressed(MOUSE_LEFT_BUTTON)) {
                Vector2 mousePos = GetMousePosition();
                if (CheckCollisionPointRec(mousePos, menu.playButton)) {
                    currentState = PLAYING;
                    Reset();
                }
                else if (CheckCollisionPointRec(mousePos, menu.exitButton)) {
                    ExitGame = true;
                }
                else if (CheckCollisionPointRec(mousePos, menu.logoutButton)) {
                    // Đăng xuất
                    isLoggedIn = false;
                    currentState = LOGIN;
                    ResetLoginInput();
                }
            }
        }
        else if (currentState == PLAYING) {
            if (IsKeyPressed(KEY_UP)) snake.ChangeDirection({0, -1});
            if (IsKeyPressed(KEY_DOWN)) snake.ChangeDirection({0, 1});
            if (IsKeyPressed(KEY_LEFT)) snake.ChangeDirection({-1, 0});
            if (IsKeyPressed(KEY_RIGHT)) snake.ChangeDirection({1, 0});
            if (IsKeyPressed(KEY_P) || IsKeyPressed(KEY_ESCAPE)) currentState = PAUSED;
        }
        else if (currentState == GAME_OVER) {
            if (IsKeyPressed(KEY_SPACE)) {
                writeHighScoreToFile();
                currentState = MENU;
            }
            else if(IsKeyPressed(KEY_A)){
                currentState = PLAYING;
                Reset();
            }
        }
        else if (currentState == PAUSED) {
            if(IsKeyPressed(KEY_ESCAPE)) currentState = PLAYING;
            if (IsMouseButtonPressed(MOUSE_LEFT_BUTTON)) {
                Vector2 mousePos = GetMousePosition();
                if (CheckCollisionPointRec(mousePos, pause.exitGame)) {
                    currentState = MENU;
                }
                else if(CheckCollisionPointRec(mousePos, pause.continuePlay)){
                    currentState = PLAYING;
                }
            }
        }
    }

    void Reset() {
        snake.Reset();
        food.Respawn(snake, false);
        specialFood.Respawn(snake, false);
        score = 0;
        gameOver = false;
        speed = 1.0f;
    }

    void readHighScoreFromFile() {
        std::ifstream file("data.txt");
        if (file.is_open()) {
            file >> highScore;
            file.close();
        } else {
            highScore = 0; 
        }
    }

    void writeHighScoreToFile() {
        std::ofstream file("data.txt");
        if (file.is_open()) {
            file << highScore;
            file.close();
        }
    }

    float GetSpeed() const { return speed; }
    bool IsGameOver() const { return gameOver; }
    GameState GetState() const { return currentState; }
    bool shoudExit() const {return ExitGame; }
};