<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SafeZoneController extends Controller
{
    /**
     * Display the SAFE ZONE main view.
     */
    public function index()
    {
        return view('safezone');
    }
}
