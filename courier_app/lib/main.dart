import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'Controller/Login_controller.dart';
import 'Global/Socet.dart';
import 'Page/Login_page.dart';
import 'Page/home_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  Get.put(AuthController()); // AuthController-ni global qilish
  await SocketService.initSocket(); // Socket ishga tushurish
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: '/',
      getPages: [
        GetPage(name: '/', page: () => LoginScreen()),
        GetPage(name: '/home', page: () => OrdersPage()),
      ],
    );
  }
}
