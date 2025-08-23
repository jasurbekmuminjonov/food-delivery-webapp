import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class TokenSave {
  static const _storage = FlutterSecureStorage();
  static const _tokenKey = "auth_token";
  static const _courierKey = "courier_id";

  // ===== Token =====
  static Future<void> saveToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
  }

  static Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }
  static Future<void> clearToken() async {
    await _storage.delete(key: _tokenKey);
  }

  // ===== Courier ID =====
  static Future<void> saveCourierId(String courierId) async {
    await _storage.write(key: _courierKey, value: courierId);
  }

  static Future<String?> getCourierId() async {
    return await _storage.read(key: _courierKey);
  }

  static Future<void> clearCourierId() async {
    await _storage.delete(key: _courierKey);
  }

  // ===== Order ma’lumotlari (SharedPreferences) =====
  static Future<void> saveOrderData(Map<String, dynamic> data) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('order_${data['id']}', jsonEncode(data));
    print("✅ Buyurtma ma’lumotlari saqlandi: $data");
  }

  static Future<Map<String, dynamic>?> getOrderData(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonString = prefs.getString('order_$id');
    if (jsonString != null) {
      return jsonDecode(jsonString);
    }
    return null;
  }

  static Future<void> clearAll() async {
    // Token va courier_id ni o‘chirish
    await _storage.deleteAll();

    // SharedPreferences (buyurtmalarni) tozalash
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();

    print("🧹 Hamma ma’lumotlar tozalandi!");
  }
}
