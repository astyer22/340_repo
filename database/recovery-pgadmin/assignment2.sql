-- Data for table 'account'
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Modify the Tony Stark record to change the account_type to "Admin".
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- Delete the Tony Stark record from the account table.
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

-- Update GM Hummer H2 description to replace "small interiors" with "a huge interior".
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM';

--inner join
SELECT i.inv_make, i.inv_model, cl.classification_name
FROM inventory i
INNER JOIN classification cl
ON i.classification_id = cl.classification_id
WHERE cl.classification_name = 'Sport';

--update image paths
UPDATE public.inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
