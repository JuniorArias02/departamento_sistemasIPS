# Ruta donde se guardará la imagen localmente
$imgPath = "$env:ProgramData\loc# Ruta donde se guardará la imagen localmente
$imgPath = "$env:ProgramData\lockscreen.png"

# URL de la imagen (asegúrate de que esté accesible públicamente sin /public/)
$imgURL = "https://departamento-sistemasips.vercel.app/imgdesktop.png"

# Descarga la imagen
Invoke-WebRequest -Uri $imgURL -OutFile $imgPath

# Crea la clave del registro si no existe
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Personalization" -Force | Out-Null

# Establece la imagen como fondo de pantalla de bloqueo
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Personalization" -Name "LockScreenImage" -Value $imgPath

# (Opcional) Asegura que el Lock Screen esté habilitado
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Personalization" -Name "NoLockScreen" -Value 0

Write-Output "✅ Fondo de bloqueo actualizado correctamente."
kscreen.png"

# URL de la imagen (asegúrate de que esté accesible públicamente sin /public/)
$imgURL = "https://departamento-sistemasips.vercel.app/imgdesktop.png"

# Descarga la imagen
Invoke-WebRequest -Uri $imgURL -OutFile $imgPath

# Crea la clave del registro si no existe
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Personalization" -Force | Out-Null

# Establece la imagen como fondo de pantalla de bloqueo
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Personalization" -Name "LockScreenImage" -Value $imgPath

# (Opcional) Asegura que el Lock Screen esté habilitado
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Personalization" -Name "NoLockScreen" -Value 0

Write-Output "Fondo de bloqueo actualizado correctamente."
