CREATE TABLE Adresse (
	idAdresse int NOT NULL IDENTITY(1,1),
	noRue varchar(100) not null,
	nomRue varchar(100) not null,
	nomVille varchar(100) not null,
    province varchar(100) not null,
	codePostal varchar(10) not null
	primary key (idAdresse)
);


CREATE TABLE Utilisateurs (
	idUser int NOT NULL IDENTITY(100,1) primary key,
	motDePasse varchar(255) not null,
	nom varchar(25) not null,
	pkIdAdresse int not null,
	photoDeProfile varchar(255) null,
	noTelephone varchar(15)not null,
	email varchar(50) not null,
	CONSTRAINT fk_AdressUtilisateur FOREIGN KEY (pkIdAdresse) REFERENCES Adresse(idAdresse)
);

Create table SectionAliments (
	idSectionAliment int NOT NULL IDENTITY(100,1) primary key,
	nom varChar(30),
);

Create table Aliments (
	idAliment int NOT NULL IDENTITY(100,1) primary key,
	nom varChar(30),
	prix Int,
	qte Int,
	[description] varChar(150)
);
                                                                                                                                                                                
Create table CategoriesRestaurant (
	idCategoriesRestaurant int NOT NULL IDENTITY(100,1) primary key,
	nom varChar(30)
);

CREATE TABLE Restaurants (
	idRestaurant int NOT NULL IDENTITY(100,1) primary key,
	nom varchar(255),
	logoImage varchar(255),
	[description] text,
    nbTables int,
	noPhone varchar(30),
    pkIdCategRestaurant int,
    pkIdAdresse int,
	CONSTRAINT fk_AdressURestaurant FOREIGN KEY (pkIdAdresse) REFERENCES Adresse(idAdresse),
	CONSTRAINT fk_Categoried FOREIGN KEY (pkIdCategRestaurant) REFERENCES CategoriesRestaurant(idCategoriesRestaurant),
);

Create table Menu (
	pkSectionAliments int,
	pkRestaurant int,
	pkIdAliment int,
	constraint pk_Menu primary key(pkSectionAliments,pkRestaurant,pkIdAliment),
	constraint fk_SectionAliment FOREIGN KEY (pkSectionAliments) REFERENCES SectionAliments(idSectionAliment),
	constraint fk_Restaurant FOREIGN KEY (pkRestaurant) REFERENCES Restaurants(idRestaurant),
	constraint fk_Aliment FOREIGN KEY (pkIdAliment) REFERENCES Aliments(idAliment)
);

CREATE TABLE Reservations (
	idReservation int NOT NULL IDENTITY(100,1) primary key,
	dateReservation date,
	nbPerson int,
	note text,
	pkIdRestaurant int foreign key references Restaurants (idRestaurant)
);

CREATE TABLE Utilisateur_Reservation (
	pkUtilisateur int foreign key references Utilisateurs(idUser),
	pkReservation int foreign key references Reservations (idReservation)
);


CREATE TABLE RestaurantFavorit (
	pkUtilisateur int foreign key references Utilisateurs(idUser),
	pkRestaurant int foreign key references Restaurants (idRestaurant)
);


