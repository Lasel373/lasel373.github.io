<?php
$data = json_decode(file_get_contents('php://input'), true);
$filename = basename($data['filename']); // nur Dateiname, keine Pfade
$content = $data['content'];

$filepath = __DIR__ . '/' . $filename;


if (file_put_contents($filepath, $content) !== false) {
    echo json_encode(['status' => 'ok']);
} else {
    echo json_encode(['status' => 'error']);
}
?>
