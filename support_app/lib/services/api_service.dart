import 'package:dio/dio.dart';

class ApiService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'http://127.0.0.1:8000/api/',
    connectTimeout: const Duration(seconds: 5),
    receiveTimeout: const Duration(seconds: 3),
  ));

  Future<String> login(String email, String password) async {
    try {
      final response = await _dio.post(
        'auth/login/',
        data: {'email': email, 'password': password},
      );
      return response.data['token'];
    } on DioException catch (e) {
      throw Exception('Ошибка входа: ${e.response?.data ?? e.message}');
    }
  }
}