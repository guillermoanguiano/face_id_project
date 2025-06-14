import { app, BrowserWindow, shell } from "electron";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// ES modules equivalents
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Detectar si estamos en desarrollo
const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

let mainWindow;

function createWindow() {
  // Crear la ventana principal
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // Para permitir acceso a la cámara
      allowRunningInsecureContent: true,
    },
    show: false,
    autoHideMenuBar: !isDev, // Ocultar menú en producción
    title: "Gym Face Recognition",
  });

  // Cargar la aplicación
  if (isDev) {
    // En desarrollo, cargar desde el servidor de Vite
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    // En producción, cargar el archivo build
    mainWindow.loadFile(join(__dirname, "../dist/index.html"));
  }

  // Mostrar ventana cuando esté lista
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    // Modo kiosco en producción
    if (!isDev) {
      mainWindow.setFullScreen(true);
      mainWindow.setMenuBarVisibility(false);
    }
  });

  // Manejar enlaces externos
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Este método se llamará cuando Electron haya terminado la inicialización
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // En macOS, re-crear la ventana cuando se hace clic en el icono del dock
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Salir cuando todas las ventanas estén cerradas
app.on("window-all-closed", () => {
  // En macOS, es común que las apps permanezcan activas hasta que el usuario las cierre explícitamente con Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Configuración de seguridad y permisos para la cámara
app.commandLine.appendSwitch("--enable-features", "VizDisplayCompositor");
app.commandLine.appendSwitch("--disable-web-security");
app.commandLine.appendSwitch("--allow-running-insecure-content");

// Permisos para la cámara
app.commandLine.appendSwitch("--enable-usermedia-screen-capturing");
app.commandLine.appendSwitch("--allow-http-screen-capture");

// Deshabilitar atajos peligrosos en producción
if (!isDev) {
  app.on("web-contents-created", (event, contents) => {
    contents.on("before-input-event", (event, input) => {
      // Deshabilitar F12, Ctrl+R, Ctrl+Shift+I, etc.
      if (
        input.key === "F12" ||
        (input.control && input.key === "r") ||
        (input.control && input.shift && input.key === "I") ||
        (input.control && input.shift && input.key === "J")
      ) {
        event.preventDefault();
      }
    });
  });
}
