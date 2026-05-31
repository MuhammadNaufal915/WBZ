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

use App\Http\Controllers\RatingController;

// ─── Public Content (Landing Page reads) ─────────────────────────────────────
Route::get('/content/{section}', [ContentController::class, 'show']);

// ─── Public Ratings ───────────────────────────────────────────────────────────
Route::get('/ratings', [RatingController::class, 'index']);
Route::post('/ratings', [RatingController::class, 'store']);

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
    Route::post('/admin/upload-video',     [ContentController::class, 'uploadVideo']);
    Route::post('/admin/upload-poster',    [ContentController::class, 'uploadPoster']);

    // Ratings management
    Route::delete('/admin/ratings/{id}',   [RatingController::class, 'destroy']);
});
