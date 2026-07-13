<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SAFE ZONE - Demo Đa Kịch Bản Thiên Tai Việt Nam</title>
    
    @vite(['resources/css/safezone.css', 'resources/js/safezone.js'])
</head>
<body>

    <div id="map"></div>

    <div id="sidebar" class="d-flex flex-column">
        <div class="d-flex align-items-center justify-content-between mb-4">
            <h2 class="mb-0">SAFE ZONE</h2>
            @auth
                <div class="text-end small">
                    <div>Xin chào, {{ auth()->user()->name }}</div>
                    <form method="POST" action="{{ route('logout') }}" class="m-0">
                        @csrf
                        <button type="submit" class="btn btn-sm btn-danger">Đăng xuất</button>
                    </form>
                </div>
            @endauth
            @guest
                <div class="auth-links d-flex gap-2">
                    <a href="{{ route('login') }}" class="btn btn-sm btn-outline-light">Đăng nhập</a>
                    <a href="{{ route('register') }}" class="btn btn-sm btn-light">Đăng ký</a>
                </div>
            @endguest
        </div>
        
        <div class="mode-box">
            <div class="mode-title">🌐 CHẾ ĐỘ THỰC TẾ TẠI CHỖ</div>
            <button class="btn btn-success w-100" onclick="startRealTimeGPS()">Quét Vị Trí Thực Tế (GPS)</button>
        </div>

        <div class="mode-box">
            <div class="mode-title">⛰️ MÔ PHỎNG 1: ĐÈO MÃ PÍ LÈNG</div>
            <button class="btn btn-warning w-100" onclick="startSimMaPiLeng()">Kích Hoạt Kịch Bản Đèo</button>
        </div>

        <div class="mode-box">
            <div class="mode-title">🏞️ MÔ PHỎNG 2: MƯỜNG LAY (ĐIỆN BIÊN)</div>
            <button class="btn btn-warning w-100" onclick="startSimMuongLay()">Kích Hoạt Kịch Bản Sông Sườn</button>
        </div>

        <div class="mode-box">
            <div class="mode-title">🌲 MÔ PHỎNG 3: VQG BÙ GIA MẬP</div>
            <button class="btn btn-primary w-100" onclick="startSimBGM()">Kích Hoạt Kịch Bản Rừng Núi</button>
        </div>

        <p style="margin: 10px 0 5px 0;">Trạng thái thiên tai:</p>
        <div id="user-status" class="status safe">Đang chờ kịch bản...</div>

        <div id="ai-box">
            <div class="ai-title">PHÂN TÍCH LÝ THUYẾT ĐẤT:</div>
            <div id="ai-status">Vui lòng chọn kịch bản để phân tích...</div>
            <div id="ai-report" style="margin-top: 10px;"></div>
        </div>
    </div>

</body>
</html>