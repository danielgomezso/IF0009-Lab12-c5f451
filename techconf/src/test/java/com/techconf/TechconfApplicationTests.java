package com.techconf;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class TechconfApplicationTests {
    @LocalServerPort
    private int port;

    private final HttpClient client = HttpClient.newHttpClient();

    private HttpResponse<String> post(String ruta, String json) throws Exception {
        return client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + ruta))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json)).build(), HttpResponse.BodyHandlers.ofString());
    }

    @Test
    void consultaAsistentesSinRecursion() throws Exception {
        var response = client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/api/charlas"))
                .GET().build(), HttpResponse.BodyHandlers.ofString());
        assertEquals(200, response.statusCode());
        assertTrue(response.body().contains("Ana Rojas"));
        assertTrue(response.body().contains("Maria Castro"));
        assertTrue(response.body().contains("\"asistentes\""));
        assertFalse(response.body().contains("\"charla\":"));
    }

    @Test
    void inscribeYConsultaAsistente() throws Exception {
        var response = post("/api/charlas/2/asistentes",
                "{\"nombre\":\"Prueba Integracion\",\"correo\":\"prueba@example.com\",\"edad\":19}");
        assertEquals(201, response.statusCode());
        assertFalse(response.body().contains("\"charla\":"));
        var consulta = client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/api/charlas"))
                .GET().build(), HttpResponse.BodyHandlers.ofString());
        assertEquals(200, consulta.statusCode());
        assertTrue(consulta.body().contains("Prueba Integracion"));
    }

    @Test
    void rechazaDatosInvalidosYCharlaInexistente() throws Exception {
        for (String json : new String[] {
                "{\"nombre\":\"Ana\",\"correo\":\"ana@example.com\",\"edad\":18}",
                "{\"nombre\":\"Ab\",\"correo\":\"ana@example.com\",\"edad\":19}",
                "{\"nombre\":\"Ana\",\"correo\":\"incorrecto\",\"edad\":19}",
                "{}" }) {
            assertEquals(400, post("/api/charlas/1/asistentes", json).statusCode());
        }
        assertEquals(404, post("/api/charlas/999/asistentes",
                "{\"nombre\":\"Ana\",\"correo\":\"ana@example.com\",\"edad\":19}").statusCode());
    }

    @Test
    void validaElRegistroDeCharlas() throws Exception {
        String charla = "{\"titulo\":\"Prueba Angular\",\"expositor\":\"Ana\",\"nivel\":\"Principiante\","
                + "\"emailContacto\":\"ana@example.com\",\"fechaInicio\":\"2026-11-02\","
                + "\"fechaFin\":\"2026-11-03\",\"etiquetas\":[\"Angular\"]}";
        assertEquals(200, post("/api/charlas", charla).statusCode());
        assertEquals(400, post("/api/charlas", charla.replace("2026-11-03", "2026-11-01")).statusCode());
        assertEquals(400, post("/api/charlas", charla.replace("[\"Angular\"]", "[]")).statusCode());
        assertEquals(400, post("/api/charlas", "{}").statusCode());
    }
}
