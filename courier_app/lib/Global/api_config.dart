class ApiConfig {
  static const String baseUrl = "https://bimserver.richman.uz/api/v1";
  static const String baseUrlImg = "https://bimserver.richman.uz";
  static const String baseUrlSocet = "https://bimserver.richman.uz";

  static Uri courierLogin() => Uri.parse("$baseUrl/token/courier/login");
  static Uri courierAllOrder() => Uri.parse("$baseUrl/token/order/get/courier");
}
