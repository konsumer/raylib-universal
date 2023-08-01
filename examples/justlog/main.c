#include "raylib-universal.h"

WASM_EXPORT void InitGame() {
  InitWindow(320, 240, "Raylib Universal");

  TraceLog(LOG_INFO, "This is a test: %d-%d-%d %s %.2f", 1, 2, 3, "TESTING", 4.5);
}

WASM_EXPORT void UpdateGame() {
  BeginDrawing();
  ClearBackground(RAYWHITE);
  DrawText("Updated", 10, 10, 40, BLACK);
  EndDrawing();
}