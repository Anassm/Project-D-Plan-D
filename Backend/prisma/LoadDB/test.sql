UPDATE flight
SET
    diverted = CASE
        WHEN diverted = 'WAAR' THEN true
        WHEN diverted = 'ONWAAR' THEN false
        ELSE diverted -- In case there are any unexpected values
    END,
    nachtvlucht = CASE
        WHEN nachtvlucht = 'WAAR' THEN true
        WHEN nachtvlucht = 'ONWAAR' THEN false
        ELSE nachtvlucht -- In case there are any unexpected values
    END,
    publicannouncement = CASE
        WHEN publicannouncement = 'WAAR' THEN true
        WHEN publicannouncement = 'ONWAAR' THEN false
        ELSE publicannouncement -- In case there are any unexpected values
    END;
     EU = CASE
        WHEN EU = 'WAAR' THEN true
        WHEN EU = 'ONWAAR' THEN false
        ELSE EU -- In case there are any unexpected values
    END;
    schengen = CASE
        WHEN schengen = 'WAAR' THEN true
        WHEN schengen = 'ONWAAR' THEN false
        ELSE schengen -- In case there are any unexpected values
    END;
