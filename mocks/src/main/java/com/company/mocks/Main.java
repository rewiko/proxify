package com.company.mocks;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.common.FileSource;

import java.io.IOException;
import org.apache.commons.cli.*;

import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;

public class Main {
    static {
        System.setProperty("org.mortbay.log.class", "com.github.tomakehurst.wiremock.jetty.LoggerAdapter");
    }

    public static void main(String[] args) throws IOException {

      Options options = new Options();

      Option input = new Option("r", "root-dir", true, "mappings path");
      input.setRequired(true);
      options.addOption(input);

      CommandLineParser parser = new DefaultParser();
      HelpFormatter formatter = new HelpFormatter();
      CommandLine cmd;

      try {
        cmd = parser.parse(options, args);
      } catch (ParseException e) {
        System.out.println(e.getMessage());
        formatter.printHelp("utility-name", options);

        System.exit(1);
        return;
      }

        String inputFilePath = cmd.getOptionValue("root-dir");

        System.out.println(inputFilePath);

        WireMockServer wireMockServer = new WireMockServer(wireMockConfig()
                .port(8080)
                .containerThreads(100)
                .jettyAcceptors(10)
                .jettyAcceptQueueSize(1000)
                .jettyHeaderBufferSize(16834)
                .disableRequestJournal()
                .usingFilesUnderDirectory(cmd.getOptionValue("root-dir"))
        );
        wireMockServer.start();

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            wireMockServer.stop();
        }));
    }
}
