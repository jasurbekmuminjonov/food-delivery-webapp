import 'dart:convert';
import 'package:http/http.dart' as http;
import '../Global/Token_save.dart';
import '../Global/api_config.dart';
import '../Model/ProducModel.dart';

class ProductService {
  static Future<List<Order>> getOrders() async {
    final token = await TokenSave.getToken();
    if (token == null || token.isEmpty) {
      throw Exception("❌ Token topilmadi. Avval login qiling.");
    }
    print("Token: $token");

    final response = await http.get(
      ApiConfig.courierAllOrder(),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((e) => Order.fromJson(e)).toList();
    } else {
      // Server xatolik javobini JSON sifatida parse qilish
      try {
        final errorJson = jsonDecode(response.body) as Map<String, dynamic>;
        throw Exception(
          errorJson['error']?.toString() ??
              'Server error: ${response.statusCode}',
        );
      } catch (e) {
        throw Exception("Xatolik: ${response.statusCode} - ${response.body}");
      }
    }
  }

  static Future<bool> completeDelivering(
    String orderId,
    String paymentMethod,
  ) async {
    try {
      final token = await TokenSave.getToken();
      if (token == null || token.isEmpty) {
        print("❌ Token topilmadi. Avval login qiling.");
        throw Exception("Token topilmadi");
      }
      final url = Uri.parse(
        "${ApiConfig.baseUrl}/token/order/complete/delivering/$orderId",
      );

      final response = await http.put(
        url,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
        body: jsonEncode({"payment_method": paymentMethod}),
      );
      print(response.body);
      if (response.statusCode == 200) {
        print("✅ Zakaz yopildi: ${response.body}");
        final Map<String, dynamic> responseData = jsonDecode(response.body);
        await TokenSave.saveOrderData(responseData);
        return true;
      } else {

        print("❌ Server xato [${response.statusCode}]: ${response.body}");
        return false;
      }
    } catch (e) {
      print("❌ So‘rovda xato: $e");
      return false;
    }
  }
}
