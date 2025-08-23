// Socket.dart file - Debug versiya
import 'package:bot_dostopa/Global/api_config.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'Token_save.dart';

class SocketService {
  static IO.Socket? _socket;
  static String? _courierId;
  static bool _isInitialized = false;

  static bool get isConnected => _socket?.connected ?? false;
  static IO.Socket? get socket => _socket;

  static Future<void> initSocket() async {
    if (_isInitialized && _socket != null && _socket!.connected) {
      return;
    }

    try {
      _courierId = await TokenSave.getCourierId();

      if (_courierId == null || _courierId!.isEmpty) {
        throw Exception("Courier ID topilmadi");
      }

      if (_socket != null) {
        _socket!.dispose();
        _socket = null;
        await Future.delayed(Duration(milliseconds: 500));
      }
      _socket = IO.io(
        '${ApiConfig.baseUrlSocet}',
        IO.OptionBuilder()
            .setTransports(['websocket'])
            .enableAutoConnect()
            .setReconnectionDelay(2000)
            .setReconnectionDelayMax(5000)
            .setTimeout(20000)
            .setQuery({'courier_id': _courierId})
            .build(),
      );

      _setupSocketEvents();

      await _waitForConnection();

      _isInitialized = true;
    } catch (e) {
      _isInitialized = false;

      Future.delayed(const Duration(seconds: 3), () {
        initSocket();
      });
    }
  }

  static void _setupSocketEvents() {
    if (_socket == null) {
      return;
    }

    _socket!.onConnect((_) {
      if (_courierId != null && _courierId!.isNotEmpty) {
        _socket!.emit('register_courier', {
          'courier_id': _courierId,
          'timestamp': DateTime.now().millisecondsSinceEpoch,
          'app_version': '1.0.0',
        });
      }
    });

    _socket!.onDisconnect((reason) {
      if (reason != 'io client disconnect') {
        print("🔄 Avtomatik qayta ulanish...");
        Future.delayed(const Duration(seconds: 2), () {
          if (_socket != null && !_socket!.connected) {
            _socket!.connect();
          }
        });
      }
    });

    _socket!.onReconnect((attempt) {
      if (_courierId != null && _courierId!.isNotEmpty) {
        _socket!.emit('register_courier', {'courier_id': _courierId});
      }
    });
    _socket!.on('preparing_completed', (data) {
      print("📡 Event: preparing_completed");
      print("📡 Data: $data");
      Future.delayed(Duration.zero, () {
        _notifyOrderUpdate('preparing_completed', data);
      });
    });    _socket!.on('order_canceled', (data) {
      Future.delayed(Duration.zero, () {
        _notifyOrderUpdate('order_canceled', data);
      });
    });
    // DELIVERING uchun turli xil event nomlari
    _socket!.on('delivering', (data) {
      Future.delayed(Duration.zero, () {
        _notifyOrderUpdate('delivering', data);
      });
    });

    _socket!.on('order_delivering', (data) {
      Future.delayed(Duration.zero, () {
        _notifyOrderUpdate('delivering', data);
      });
    });

    _socket!.on('courier_registered', (data) {

    });
    _socket!.on('ping', (_) {
      _socket!.emit('pong');
    });
  }

  static final List<Function(String, dynamic)> _listeners = [];

  static void addListener(Function(String, dynamic) listener) {
    if (!_listeners.contains(listener)) {
      _listeners.add(listener);
      print(
        "👂 Yangi listener qo'shildi. Jami listeners: ${_listeners.length}",
      );
    } else {
      print("⚠️ Listener allaqachon mavjud, takrorlanmadi");
    }
  }

  static void removeListener(Function(String, dynamic) listener) {
    final removed = _listeners.remove(listener);
    if (removed) {
      print(
        "🗑️ Listener olib tashlandi. Qolgan listeners: ${_listeners.length}",
      );
    } else {
      print("⚠️ Listener topilmadi, olib tashlanmadi");
    }
  }
  static void _notifyOrderUpdate(String event, dynamic data) {
    if (_listeners.isEmpty) {
      return;
    }

    for (int i = 0; i < _listeners.length; i++) {
      try {
        _listeners[i](event, data);
      } catch (e) {
      }
    }
  }

  static Future<void> _waitForConnection({int maxWaitSeconds = 15}) async {
    print("⏳ Socket ulanishi kutilmoqda... (max: ${maxWaitSeconds}s)");

    int waitedSeconds = 0;
    while (!isConnected && waitedSeconds < maxWaitSeconds) {
      await Future.delayed(const Duration(seconds: 1));
      waitedSeconds++;
      print(
        "⏳ Kutish: ${waitedSeconds}s/${maxWaitSeconds}s - Connected: $isConnected",
      );

      if (waitedSeconds % 5 == 0) {
        print("🔍 Socket holati tekshiruvi:");
        print("   - Socket: ${_socket != null ? 'mavjud' : 'null'}");
        print("   - Connected: $isConnected");
        print("   - Socket ID: ${_socket?.id ?? 'yo\'q'}");
      }
    }

    if (!isConnected) {
      print("⚠️ ========== SOCKET ULANISH VAQTI TUGADI ==========");
      throw Exception("Socket ulanish vaqti tugadi (${maxWaitSeconds}s)");
    } else {
      print("✅ Socket muvaffaqiyatli ulanib, tayyor!");
    }
  }

  static Future<void> reconnect() async {
    print("🔄 ========== MANUAL RECONNECT BOSHLANDI ==========");

    try {
      if (_socket != null) {
        print("🔌 Mavjud socket disconnect qilinmoqda...");
        _socket!.disconnect();
        await Future.delayed(const Duration(milliseconds: 1500));

        print("🔌 Socket qayta connect qilinmoqda...");
        _socket!.connect();
        await _waitForConnection(maxWaitSeconds: 10);

        print("✅ Manual reconnect muvaffaqiyatli");
      } else {
        print("🆕 Socket mavjud emas, yangi socket yaratilmoqda...");
        await initSocket();
      }
    } catch (e) {
      print("❌ Manual reconnect xatosi: $e");

      _isInitialized = false;
      await initSocket();
    }
  }

  static void checkConnection() {
    if (_socket == null) {
      print("❌ Socket: NULL");
      return;
    }
  }

  static void testEmit(String event, dynamic data) {
    if (_socket != null && _socket!.connected) {
      print("🧪 Test emit: $event - $data");
      _socket!.emit(event, data);
    } else {
      print("❌ Socket ulanmagan, test emit amalga oshmadi");
    }
  }

  static Future<bool> ensureConnection() async {
    if (isConnected) {
      return true;
    }

    print("🔄 Socket ulanmagan, qayta ulanish...");
    try {
      await reconnect();
      return isConnected;
    } catch (e) {
      print("❌ Ensure connection xatosi: $e");
      return false;
    }
  }

  static void dispose() {
    print("🗑️ ========== SOCKET DISPOSE ==========");

    final listenerCount = _listeners.length;
    _listeners.clear();
    print("🗑️ ${listenerCount} ta listener tozalandi");

    if (_socket != null) {
      _socket!.dispose();
      _socket = null;
      print("🗑️ Socket disposed");
    }

    _isInitialized = false;
    _courierId = null;
  }
}