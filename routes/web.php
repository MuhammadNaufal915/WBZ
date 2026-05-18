<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes — SPA Catch-All
|--------------------------------------------------------------------------
| Laravel serves the React SPA shell for all routes. React Router handles
| client-side routing for /admin/login, /admin/*, etc.
|--------------------------------------------------------------------------
*/

Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
