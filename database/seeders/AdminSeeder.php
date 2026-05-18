<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Admin::firstOrCreate(
            ['email' => 'admin@wbz.id'],
            [
                'name'     => 'WBZ Admin',
                'password' => Hash::make('wbz@admin2024'),
            ]
        );
    }
}
