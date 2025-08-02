# Ruta donde se guardará la imagen
$imgPath = "C:\Windows\Web\Screen\lockscreen.jpg"

# URL pública de la imagen
$imgURL = "https://departamento-sistemasips.vercel.app/imgdesktop.jpg"

# Descargar imagen
Invoke-WebRequest -Uri $imgURL -OutFile $imgPath -UseBasicParsing

# Crear clave si no existe
$regPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\System"
if (-Not (Test-Path $regPath)) {
    New-Item -Path $regPath -Force | Out-Null
}

# Activar personalización forzada
Set-ItemProperty -Path $regPath -Name "DisableLogonBackgroundImage" -Value 0 -Type DWord

# Usar imagen como fondo (se necesita aplicar desde el sistema con herramienta externa)
Write-Output "Windows 11 no permite cambiar el lockscreen solo con el registro. Se debe usar un script con herramientas de terceros como `Windows Spotlight` deshabilitado o `Group Policy` forzada con imágenes personalizadas."
