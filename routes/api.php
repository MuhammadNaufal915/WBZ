<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\ContentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ─── Public Content (Landing Page reads) ─────────────────────────────────────
Route::get('/content/{section}', [ContentController::class, 'show']);

// ─── Admin Auth ───────────────────────────────────────────────────────────────
Route::post('/admin/login', [AdminAuthController::class, 'login']);

// ─── Protected Admin Routes (Sanctum token) ───────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/admin/logout',           [AdminAuthController::class, 'logout']);
    Route::get('/admin/me',                [AdminAuthController::class, 'me']);
    Route::post('/admin/change-password',  [AdminAuthController::class, 'changePassword']);

    // Content management
    Route::put('/admin/content/{section}', [ContentController::class, 'update']);
    Route::post('/admin/upload',           [ContentController::class, 'upload']);
});
