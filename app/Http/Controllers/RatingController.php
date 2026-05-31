<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Rating;

class RatingController extends Controller
{
    public function index()
    {
        $ratings = Rating::latest()->get();
        return response()->json($ratings);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'message' => 'nullable|string',
        ]);

        $rating = Rating::create($validated);

        return response()->json(['message' => 'Rating submitted successfully', 'data' => $rating], 201);
    }

    public function destroy($id)
    {
        $rating = Rating::findOrFail($id);
        $rating->delete();
        return response()->json(['message' => 'Rating deleted successfully']);
    }
}
