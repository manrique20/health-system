<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');


Route::get('/General', function () {
    return Inertia::render('General');
})->name('general');


Route::get('/patient/{id}', function ($id) {
    return Inertia::render('patient/show', ['id' => $id]);
})->name('patient.show');

Route::get('/doctor/{id}', function ($id) {
    return Inertia::render('doctor/show', ['id' => $id]);
})->name('doctor.show');