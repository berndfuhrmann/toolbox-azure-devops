package de.netzquantum.toolboxazuredevopsbybf;

import org.eclipse.epsilon.egl.formatter.Formatter;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;

/**
 * Formats EGL output with prettier by piping it through src-gen/formatter/format.mjs.
 */
public class PrettierFormatter implements Formatter {

    private static final Path scriptPath = Paths.get("src-gen", "formatter", "format.mjs");

    private final Path script = findScript();

    @Override
    public String format(String text) {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder("node", script.toString());
            // Let prettier's error messages show up in the Maven log
            processBuilder.redirectError(ProcessBuilder.Redirect.INHERIT);
            Process process = processBuilder.start();

            try (OutputStream input = process.getOutputStream()) {
                input.write(text.getBytes(StandardCharsets.UTF_8));
            }

            String output;
            try (InputStream outputStream = process.getInputStream()) {
                output = new String(outputStream.readAllBytes(), StandardCharsets.UTF_8);
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new IllegalStateException("Prettier failed with exit code " + exitCode);
            }
            return output;
        } catch (IOException | InterruptedException e) {
            throw new IllegalStateException("Could not run prettier", e);
        }
    }

    /**
     * Walks up from the working directory, so generation works whether Maven is started
     * from the project root or from src-gen.
     */
    private static Path findScript() {
        for (Path directory = Paths.get("").toAbsolutePath(); directory != null; directory = directory.getParent()) {
            Path candidate = directory.resolve(scriptPath);
            if (Files.isRegularFile(candidate)) {
                return candidate;
            }
        }
        throw new IllegalStateException("Could not find " + scriptPath + " above " + Paths.get("").toAbsolutePath());
    }
}
