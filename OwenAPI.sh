#!/bin/bash
# Instalador do OwenAPI
# Autor: OwenZap
# Versao: 1.0

	whiptail=$(which whiptail) ; [[ -z $whiptail ]] && { echo "Whiptail não instalado, instale!" ; exit ; }

	function msg() {
		msg=$1
		whiptail --title "Instalacao OWEN API by OwenZap - (27 99236-9908)" --msgbox "$msg" --fb 10 70;
	}


	whiptail --title "Instalacao OWEN API by OwenZap - (27 99236-9908)" --msgbox "Aperte ENTER para iniciar a instalacao" --fb 10 70
	[[ $(whoami) != 'root' ]] && {
		whiptail --title "Para continuar a instalacao, logue-se como ROOT" --msgbox "comando: su" --fb 10 70
		exit;
	}

	porta=$(whiptail --title "Defina a PORTA para a API" --inputbox "Pressione ENTER para usar a porta: 3000, ou digite uma porta:" --fb 12 60 3>&1 1>&2 2>&3) ; saida=$?
		if [[ $saida -eq '0' ]] ; then if [[ -z $porta ]] ; then porta=3000 ; fi else echo "saindo..." ; exit ; fi


	host=$(whiptail --title "Informe o Host para a API (IP ou Dominio)" --inputbox "Pressione ENTER para usar o host: localhost, ou digite o IP da VPS ou DOMINIO:" --fb 12 60 3>&1 1>&2 2>&3) ; saida=$?
		if [[ $saida -eq '0' ]] ; then if [[ -z $host ]] ; then host=localhost ; fi else echo "saindo..." ; exit ; fi



	msg "Agora, tome um cafe ou tome uma gelada,se preferir fume um cigarro que a instalacao vai comecar!";


sudo apt update && sudo apt install unzip && curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh && sudo bash nodesource_setup.sh && sudo apt install nodejs && sudo apt update && sudo apt install mysql-server -y

cd ~

cd && cd ./OwenAPI

cp .env_exemplo .env

sed -i "/^HOST/s/.*/HOST=$host/" .env
sed -i "/^PORT/s/.*/PORT=$porta/" .env

cd && cd ./OwenAPI && sudo npm install && sudo npm install -y -g npm@latest pm2 && pm2 start app.js --name Owen_API && pm2 startup && pm2 save

cd && cd ./OwenAPI && rm -rf OwenAPI.sh

history -c
