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

	pasta=$(whiptail --title "Informe o nome para PASTA de intalação" --inputbox "Digite nome desejado para pasta da instalação:" --fb 12 60 3>&1 1>&2 2>&3) ; saida=$?
		if [[ $saida -eq '0' ]] ; then if [[ -z $pasta ]] ; then pasta=OwenAPI ; fi else echo "saindo..." ; exit ; fi

	porta=$(whiptail --title "Defina a PORTA para a API" --inputbox "Pressione ENTER para usar a porta: 3000, ou digite uma porta:" --fb 12 60 3>&1 1>&2 2>&3) ; saida=$?
		if [[ $saida -eq '0' ]] ; then if [[ -z $porta ]] ; then porta=3000 ; fi else echo "saindo..." ; exit ; fi


	host=$(whiptail --title "Informe o Host para a API (IP ou Dominio)" --inputbox "Pressione ENTER para usar o host: localhost, ou digite o IP da VPS ou DOMINIO:" --fb 12 60 3>&1 1>&2 2>&3) ; saida=$?
		if [[ $saida -eq '0' ]] ; then if [[ -z $host ]] ; then host=localhost ; fi else echo "saindo..." ; exit ; fi



	msg "A instalação já vai começa! Deseja contribuir com nosso projeto? Segue nosso PICPAY: @owenzap";


sudo apt update && sudo apt install unzip && curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh && sudo bash nodesource_setup.sh && sudo apt install nodejs && sudo apt update && sudo apt install mysql-server -y

cd ~

sudo apt install -y git && git clone https://github.com/Subkowiaki/chatbot.git ./${pasta}/

cd && cd ./${pasta}

sed -i "/^HOST/s/.*/HOST=$host/" .env
sed -i "/^PORT/s/.*/PORT=$porta/" .env

cd && cd ./${pasta} && sudo npm install && sudo npm install -y -g npm@latest pm2 && pm2 start app.js --name API_${pasta} && pm2 startup && pm2 save

cd && rm -rf OwenAPI

                                                ### FIM INSTALAÇÃO OWENBOT ###

whiptail --title "Instalacao OWEN API by OwenZap - (27 99236-9908)" --msgbox "FIM DA INSTALAÇÃO! Apoie nosso projeto! Segue nosso PICPAY: @owenzap" --fb 10 70
	[[ $(whoami) != 'root' ]] && {
		whiptail --title "logue-se como ROOT" --msgbox "comando: su" --fb 10 70
		exit;
	}
