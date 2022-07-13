CREATE TABLE IF NOT EXISTS `User` (
    `userId` int AUTO_INCREMENT NOT NULL ,
    `role` int  NOT NULL ,
    `email` varchar(256)  NOT NULL ,
    UNIQUE (email),
    PRIMARY KEY (
        `userId`
    )
);

drop trigger if exists before_insert_user;

create trigger before_insert_user
before insert
on user for each row set new.email = lower(trim(new.email));

CREATE TABLE IF NOT EXISTS `Student` (
    `studentId` int  NOT NULL ,
    `familyName` varchar(256)  NOT NULL ,
    `givenName` varchar(256)  NOT NULL ,
    `rating` int  NULL ,
    `promoId` int  NOT NULL,
    UNIQUE (studentId)
);

CREATE TABLE IF NOT EXISTS `Admin` (
    `adminId` int  NOT NULL ,
    `pseudo` varchar(256) NOT NULL ,
    `password` varchar(256) NOT NULL,
    UNIQUE (adminId),
    UNIQUE (pseudo)
);

CREATE TABLE IF NOT EXISTS `Promo` (
    `promoId` int AUTO_INCREMENT NOT NULL ,
    `promoName` varchar(256)  NOT NULL ,
    UNIQUE (promoName),
    PRIMARY KEY (
        `promoId`
    )
);

CREATE TABLE IF NOT EXISTS `Instance` (
    `challengeId` int  NOT NULL ,
    `studentId` int  NOT NULL ,
    `port` int  NOT NULL ,
    `addressIp` varchar(256)  NOT NULL ,
    `username` varchar(256)  NOT NULL
);

CREATE TABLE IF NOT EXISTS `ChallengeLevel` (
    `studentId` int  NOT NULL ,
    `questionId` int  NOT NULL
);

CREATE TABLE IF NOT EXISTS `Challenge` (
    `challengeId` int AUTO_INCREMENT NOT NULL ,
    `challengeName` varchar(256)  NOT NULL ,
    `publicKey` varchar(1024)  NOT NULL ,
    UNIQUE (challengeName),
    PRIMARY KEY (
        `challengeId`
    )
);

CREATE TABLE IF NOT EXISTS `Question` (
    `challengeId` int  NOT NULL ,
    `questionId` int AUTO_INCREMENT NOT NULL ,
    `textQuestion` varchar(256)  NOT NULL ,
    `commandQuestion` varchar(1024),
    `expectedAnswer` varchar(1024) ,
    `scoreQuestion` int  NOT NULL ,
    PRIMARY KEY (
        `questionId`
    )
);

CREATE TABLE IF NOT EXISTS `ChallengeStudent` (
    `challengeStudentId` int AUTO_INCREMENT NOT NULL ,
    `challengeId` int  NOT NULL ,
    `studentId` int  NOT NULL,
    PRIMARY KEY (
      `challengeStudentId`
    )
);

CREATE UNIQUE INDEX ix_uniq_challenge_student_id
ON ChallengeStudent(challengeId, studentId);

CREATE TABLE IF NOT EXISTS `ChallengePromo` (
    `challengePromoId` int AUTO_INCREMENT NOT NULL ,
    `challengeId` int NOT NULL,
    `promoId` int NOT NULL,
    `isOpen` boolean NOT NULL default true,
    PRIMARY KEY (
      `challengePromoId`
    )
);
CREATE UNIQUE INDEX ix_uniq_challenge_promo_id
ON ChallengePromo(challengeId, promoId);

ALTER TABLE `Student` ADD CONSTRAINT `fk_Student_studentId` FOREIGN KEY(`studentId`)
REFERENCES `User` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Student` ADD CONSTRAINT `fk_Student_promoId` FOREIGN KEY(`promoId`)
REFERENCES `Promo` (`promoId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Admin` ADD CONSTRAINT `fk_Admin_userId` FOREIGN KEY(`adminId`)
REFERENCES `User` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Instance` ADD CONSTRAINT `fk_Instance_challengeId` FOREIGN KEY(`challengeId`)
REFERENCES `Challenge` (`challengeId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Instance` ADD CONSTRAINT `fk_Instance_studentId` FOREIGN KEY(`studentId`)
REFERENCES `Student` (`studentId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ChallengeLevel` ADD CONSTRAINT `fk_ChallengeLevel_studentId` FOREIGN KEY(`studentId`)
REFERENCES `Student` (`studentId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ChallengeLevel` ADD CONSTRAINT `fk_ChallengeLevel_questionId` FOREIGN KEY(`questionId`)
REFERENCES `Question` (`questionId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Question` ADD CONSTRAINT `fk_Question_challengeId` FOREIGN KEY(`challengeId`)
REFERENCES `Challenge` (`challengeId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ChallengeStudent` ADD CONSTRAINT `fk_ChallengeStudent_challengeId` FOREIGN KEY(`challengeId`)
REFERENCES `Challenge` (`challengeId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ChallengeStudent` ADD CONSTRAINT `fk_ChallengeStudent_studentId` FOREIGN KEY(`studentId`)
REFERENCES `Student` (`studentId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ChallengePromo` ADD CONSTRAINT `fk_ChallengePromo_challengeId` FOREIGN KEY(`challengeId`)
REFERENCES `Challenge` (`challengeId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ChallengePromo` ADD CONSTRAINT `fk_ChallengePromo_studentId` FOREIGN KEY(`promoId`)
REFERENCES `Promo` (`promoId`) ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO `Promo` (promoName) VALUES ('MT4');

INSERT INTO `Challenge` (challengeName, publicKey) VALUES ('UnixShell/API', 'test');

INSERT INTO `ChallengePromo` (challengeId, promoId) VALUES (1,1);

INSERT INTO `Question` (challengeId, textQuestion, commandQuestion, expectedAnswer, scoreQuestion) VALUES (
    1,
    "Créer un fichier HelloWorld.txt dans le répertoire /home de l'utilisateur",
    "ls",
    "HelloWorld.txt",
    1
);

INSERT INTO `Question` (challengeId, textQuestion, commandQuestion, expectedAnswer, scoreQuestion) VALUES (
    1,
    "Créer un dossier textes et y déplacer le fichier HelloWorld.txt",
    "cd /textes && ls",
    "HelloWorld.txt",
    2
);

INSERT INTO `Question` (challengeId, textQuestion, commandQuestion, expectedAnswer, scoreQuestion) VALUES (
    1,
    "Télécharger node: https://github.com/nodejs/node/archive/refs/tags/v18.4.0.zip puis compter le nombre de fichiers .cc qui s’y trouvent",
    "cd node-18.4.0 && find . -name '*.cc' | wc -l",
    "1950",
    3
);

INSERT INTO `Question` (challengeId, textQuestion, commandQuestion, expectedAnswer, scoreQuestion) VALUES (
    1,
    "Ecrire un script nommé concat.sh qui concatène puis trie deux fichiers /node-18.4.0/src/connect_wrap.cc et node-18.4.0/src/connection_wrap.cc dans un nouveau fichier concat.txt affichant le nombre total de lignes.",
    "./concat.sh /node-18.4.0/src/connect_wrap.cc /node-18.4.0/src/connection_wrap.cc concat.txt",
    "Le fichier concat.txt contient 153 lignes",
    4
);

INSERT INTO `Question` (challengeId, textQuestion, commandQuestion, expectedAnswer, scoreQuestion) VALUES (
    1,
    "Créer une route /facilities permettant Ajouter une nouvelle infrastructure dans la table facilities",
    'curl -H "Content-Type: application/json" -X POST -d \"{"facid":9, "name":"Spa", "membercost":20, "guestcost":30, "initialoutlay":100000, "monthlymaintenance":800}\" http://localhost:3000/facilities',
    '{"created":true,"rows":{"facid":9,"name":"Spa","membercost":"20","guestcost":"30","initialoutlay":"100000","monthlymaintenance":"800"}}',
    1
);

INSERT INTO `Question` (challengeId, textQuestion, commandQuestion, expectedAnswer, scoreQuestion) VALUES (
    1,
    "Créer une route /surnames qui récupère les 10 premiers surname de la table members",
    "curl http://localhost:3000/surnames",
    '[{"surname":"Bader"},{"surname":"Baker"},{"surname":"Boothe"},{"surname":"Butters"},{"surname":"Coplin"},{"surname":"Crumpet"},{"surname":"Dare"},{"surname":"Farrell"},{"surname":"Genting"},{"surname":"GUEST"}]',
    2
);

INSERT INTO `Question` (challengeId, textQuestion, commandQuestion, expectedAnswer, scoreQuestion) VALUES (
    1,
    "Créer une route /recommendedMembers qui retourne une liste de membres qui ont recommandé d’autres membres",
    "curl http://localhost:3000/recommendedMembers",
    '[{"firstname":"Florence","surname":"Bader"},{"firstname":"Timothy","surname":"Baker"},{"firstname":"Gerald","surname":"Butters"},{"firstname":"Jemima","surname":"Farrell"},{"firstname":"Matthew","surname":"Genting"},{"firstname":"David","surname":"Jones"},{"firstname":"Janice","surname":"Joplette"},{"firstname":"Millicent","surname":"Purview"},{"firstname":"Tim","surname":"Rownam"},{"firstname":"Darren","surname":"Smith"},{"firstname":"Tracy","surname":"Smith"},{"firstname":"Ponder","surname":"Stibbons"},{"firstname":"Burton","surname":"Tracy"}]',
    3
);

INSERT INTO `Question` (challengeId, textQuestion, commandQuestion, expectedAnswer, scoreQuestion) VALUES (
    1,
    "Créer une route /countMembersByLetters qui compte le nombre de membres dont le nom de famille commence par chaque lettre de l'alphabet.",
    "curl http://localhost:3000/countMembersByLetters",
    '[{"letter":"B","count":"5"},{"letter":"C","count":"2"},{"letter":"D","count":"1"},{"letter":"F","count":"2"},{"letter":"G","count":"2"},{"letter":"H","count":"1"},{"letter":"J","count":"3"},{"letter":"M","count":"1"},{"letter":"O","count":"1"},{"letter":"P","count":"2"},{"letter":"R","count":"2"},{"letter":"S","count":"6"},{"letter":"T","count":"2"},{"letter":"W","count":"1"}]',
    4
);
