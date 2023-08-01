#include "raylib-universal.h"

WASM_EXPORT void InitGame() {
  InitWindow(320, 240, "Raylib Universal");

  TraceLog(LOG_INFO, "This is a test:\n%c\n%C\n%d\n%05d\n%5d\n%-5d\n%+5d\n%+5d", 'b', 'b', 100, 1, 1, 1, 1, -1);
}

WASM_EXPORT void UpdateGame() {
  BeginDrawing();
  ClearBackground(RAYWHITE);
  DrawText("Updated", 10, 10, 40, BLACK);
  EndDrawing();
}