import 'dart:convert';

import 'package:get/get.dart';
import 'package:get/get_state_manager/src/simple/get_controllers.dart';
import 'package:http/http.dart' as http;

import '../Global/Token_save.dart';
import '../Global/api_config.dart';

class AuthController extends GetxController {
  var token = "".obs;
  var courierId = "".obs;

  @override
  void onInit() {
    super.onInit();
    _loadSavedData();
  }

  Future<void> _loadSavedData() async {
    token.value = await TokenSave.getToken() ?? "";
    courierId.value = await TokenSave.getCourierId() ?? "";

    print("🔄 Qayta yuklandi: token=${token.value}, courierId=${courierId.value}");
  }

  Future<bool> loginCourier(String login, String password) async {
    try {
      final response = await http.post(
        ApiConfig.courierLogin(),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "courier_login": login,
          "courier_password": password,
        }),
      );

      print("📡 Login javobi: ${response.body}");

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);

        token.value = data['token'] ?? "";
        courierId.value = data['courier_id'] ?? "";

        if (token.value.isNotEmpty) {
          // 🔑 Saqlash
          await TokenSave.saveToken(token.value);
          await TokenSave.saveCourierId(courierId.value);

          print("✅ Token olindi va saqlandi: ${token.value}");
          print("✅ Courier ID saqlandi: ${courierId.value}");

          return true; // ✅ muvaffaqiyatli login
        } else {
          return false; // token bo‘sh bo‘lsa login xato
        }
      } else {
        print("❌ Xato: ${response.statusCode}, ${response.body}");
        return false;
      }
    } catch (e) {
      print("⚠️ Ulanish xatosi: $e");
      return false;
    }
  }
}
