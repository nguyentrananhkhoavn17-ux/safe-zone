<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SafeZoneController;
use App\Http\Controllers\HazardApiController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LogoutController;

    Route::get('/', [SafeZoneController::class, 'index'])->name('safezone');
    Route::get('/safezone', [SafeZoneController::class, 'index']);

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);
});

Route::post('/logout', [LogoutController::class, 'store'])->middleware('auth')->name('logout');


Route::get('/api/v1/hazards', [HazardApiController::class, 'index']);
