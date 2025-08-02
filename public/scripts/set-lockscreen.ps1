# Ruta local donde se guardará la imagen
$imgPath = "$env:ProgramData\lockscreen.jpg"

# URL pública de tu nueva imagen .jpg
$imgURL = "https://departamento-sistemasips.vercel.app/imgdesktop.jpg"

# Descargar la imagen
Invoke-WebRequest -Uri $imgURL -OutFile $imgPath

# Crear clave del registro si no existe
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Personalization" -Force | Out-Null

# Establecer imagen como fondo de pantalla de bloqueo
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Personalization" -Name "LockScreenImage" -Value $imgPath

# Asegurar que el lock screen esté activo
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Personalization" -Name "NoLockScreen" -Value 0

Write-Output "✅ Fondo de bloqueo actualizado correctamente."
