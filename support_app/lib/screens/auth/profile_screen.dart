import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/api_service.dart';

class ProfileScreen extends StatefulWidget {
  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late Future<Map<String, dynamic>> _profileFuture;
  final ApiService _api = ApiService();

  @override
  void initState() {
    super.initState();
    _profileFuture = _loadProfile();
  }

  Future<Map<String, dynamic>> _loadProfile() async {
    final token = 'ВАШ_ТОКЕН'; // Получайте из хранилища
    final response = await _api.getProfile(token);
    return response.data;
  }

  Future<void> _logout() async {
    try {
      final token = 'ВАШ_ТОКЕН';
      await _api.logout(token);
      Navigator.pushReplacementNamed(context, '/login');
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Ошибка выхода: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Профиль'),
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: _logout,
          ),
        ],
      ),
      body: FutureBuilder(
        future: _profileFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Ошибка загрузки профиля'));
          }
          final profile = snapshot.data!;
          return Padding(
            padding: EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Имя пользователя: ${profile['username']}'),
                Text('Email: ${profile['email']}'),
                Text('Компания: ${profile['company'] ?? 'Не указана'}'),
                Text('Телефон: ${profile['phone'] ?? 'Не указан'}'),
                Text('Роль: ${profile['role']}'),
              ],
            ),
          );
        },
      ),
    );
  }
}