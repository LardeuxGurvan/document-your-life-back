-- Deploy dyl:constraints to pg
BEGIN;

-- Add constraint to validate email format
ALTER TABLE "user"
    ADD CONSTRAINT email_check CHECK ("email" ~ '^[a-zA-Z0-9._\-àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,4}$');


COMMIT;
