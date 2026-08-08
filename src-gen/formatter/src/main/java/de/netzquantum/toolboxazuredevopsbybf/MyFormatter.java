package de.netzquantum.toolboxazuredevopsbybf;
import org.eclipse.epsilon.egl.formatter.Formatter;
import java.io.*;

public class MyFormatter implements Formatter {

    @Override
    public String format(String text) {
        try {
            // Adjust the path to your script as needed
            ProcessBuilder pb = new ProcessBuilder("node", "src-gen/formatter/src/main/resources/format.js");
            Process process = pb.start();

            // Write input to the process
            try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()))) {
                writer.write(text);
            }

            // Read output from the process
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append(System.lineSeparator());
                }
            }

            // Wait for the process to finish
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                // Optionally, read stderr for error details
                try (BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                    StringBuilder errorOutput = new StringBuilder();
                    String line;
                    while ((line = errorReader.readLine()) != null) {
                        errorOutput.append(line).append(System.lineSeparator());
                    }
                    throw new IOException("Prettier failed: " + errorOutput.toString());
                }
            }

            return output.toString().trim();
        } catch (Exception e) {
            // Fallback: return unformatted text on error
            return text;
        }
    }
}
