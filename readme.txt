==========
Làm đủ yêu cầu Y3 - Y4
==========
Làm thêm: 
 - Mỗi lần lấy data của 1 bộ câu hỏi, chỉ lấy ra random 10 câu hỏi ngẫu nhiên trong bộ câu hỏi.
 - Kiểm tra trong mảng lưu bộ câu hỏi được chọn, bỏ qua khi random trúng câu hỏi đã tồn tại trong mảng.
 - Ẩn hiện các button khi ở vìa của mảng: ở câu 1 thì ẩn nút back, ở câu cuối ẩn nút next và hiện nút nộp bài.
 - Lưu câu trả lời dưới dạng object với key là ID khóa học để xử lý các vấn đề sau:
	+ Xác định các nút mà người dùng đã ấn qua, sau đó hiện lại đúng nút ấn khi quay lại câu hỏi từ một câu hỏi khác.
	+ Nếu ấn đúng câu hỏi sẽ lưu 1 $scope, $scope này được sử dụng khi người dùng ấn vào nút nộp bài
	+ Lưu bộ random 10 câu hỏi cùng các dự liệu liên quan để làm chức năng hiện câu trả lời sau khi nộp bài
	+ Sau khi đã nộp bài sẽ ẩn section câu hỏi và hiện section kết quả; hiện thời gian và điểm số
	+ Hiện câu trả lời của bộ câu hỏi sẽ hiện kèm đáp đúng của từng câu hỏi
	+ Các câu hỏi đã được chọn sẽ hiện thêm thông tin: Nếu đúng sẽ hiện câu đó làm đúng và ngược lại
	+ Sau khi đã nộp bài thì Refresh lại trang hoặc chuyển đổi giữa các bộ câu hỏi sẽ vẫn dữ được dữ liệu về kết quả vừa làm trước đó
 	+ Bộ đếm thời gian chạy ngược từ 15p đổ về, nếu thời gian hết sẽ tự động nộp bài