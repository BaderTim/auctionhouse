package com.baderundletters.auktionshaus.backendjavaserver.object;


import com.baderundletters.auktionshaus.backendjavaserver.error.InternalFileSystemException;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidArgumentsException;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

public class ImageDto {

    private int user_id;
    private int auction_id;

    public ImageDto(int user_id, int auction_id) {
        this.user_id = user_id;
        this.auction_id = auction_id;
    }

    // passport = 1, thumbnail = 2

    public void save_image(String raw_base64, int image_id) {
        String base64Image = raw_base64;
        if(raw_base64.contains(",")) {
            try {
                base64Image = raw_base64.split(",")[1];
            } catch(Exception x) {
                throw new InvalidArgumentsException(String.format("Image %s is corrupted.", image_id));
            }
        }
        int stringLength = base64Image.length() - "data:image/png;base64,".length();
        double sizeInKB = (4 * Math.ceil((stringLength / 3))*0.5624896334383812)/1000;
        if(sizeInKB > 4000) {
            throw new InternalFileSystemException("File cannot be larger than 4000 KB.");
        }
        byte[] decodedImg;
        try {
            decodedImg = Base64.getDecoder().decode(base64Image.getBytes(StandardCharsets.UTF_8));
        } catch (Exception x) {
            throw new InvalidArgumentsException(String.format("Image %s is corrupted.", image_id));
        }
        Path destinationFile;
        String directory_path;
        try {
            if(auction_id > 0) {
                directory_path = String.format("../images/user_%s/auction_%s", user_id, auction_id);
                Files.createDirectories(Paths.get(directory_path));
                destinationFile = Paths.get(directory_path, String.format("auction_%s_image_%s.png", auction_id, image_id));
            } else {
                directory_path = String.format("../images/user_%s", user_id);
                Files.createDirectories(Paths.get(directory_path));
                destinationFile = Paths.get(directory_path, String.format("%s.png", image_id));
            }
            Files.write(destinationFile, decodedImg);
        } catch (IOException e) {
            throw new InternalFileSystemException(String.format("Could not save user %s auction %s image %s on file system. Please make sure your parameters are correct or contact a administrator.", user_id, auction_id, image_id));
        }
    }

    public String get_image(int image_id) {
        Path destinationFile;
        if (auction_id > 0) {
            destinationFile = Paths.get(String.format("../images/user_%s/auction_%s", user_id, auction_id), String.format("auction_%s_image_%s.png", auction_id, image_id));
        } else {
            destinationFile = Paths.get(String.format("../images/user_%s", user_id), String.format("%s.png", image_id));
        }
        try {
            return ("data:image/jpeg;base64,"+new String(Base64.getEncoder().encode(Files.readAllBytes(destinationFile))));
        } catch (IOException e) {
            throw new InternalFileSystemException(String.format("Could not find user %s auction %s image %s on file system. Please make sure your parameters are correct.", user_id, auction_id, image_id));
        }
    }
}
