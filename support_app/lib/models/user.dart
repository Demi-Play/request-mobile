class User {
  final int id;
  final String email;
  final String role;
  final String company;
  final String phone;

  User({
    required this.id,
    required this.email,
    required this.role,
    required this.company,
    required this.phone,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      role: json['role'],
      company: json['company'],
      phone: json['phone'],
    );
  }
}