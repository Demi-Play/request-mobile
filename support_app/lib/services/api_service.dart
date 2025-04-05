import 'package:dio/dio.dart';

class ApiService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'http://192.168.0.107:8000/api/auth/',
    connectTimeout: Duration(seconds: 5),
  ));

  Future<Response> register({
    required String username,
    required String email,
    required String password,
    required String password2,
    String? company,
    String? phone,
  }) async {
    return await _dio.post(
      'register/',
      data: {
        'username': username,
        'email': email,
        'password': password,
        'password2': password2,
        'company': company,
        'phone': phone,
      },
    );
  }

   Future<Map<String, dynamic>> login(String username, String password) async {
    final response = await _dio.post(
      'login/',
      data: {'username': username, 'password': password},
    );
    return {
      'token': response.data['token'],
      'user_id': response.data['user_id'],
    };
  }


  Future<Response> getProfile(String token) async {
    return await _dio.get(
      'profile/',
      options: Options(headers: {'Authorization': 'Token $token'}),
    );
  }

  Future<Response> logout(String token) async {
    return await _dio.post(
      'logout/',
      options: Options(headers: {'Authorization': 'Token $token'}),
    );
  }
}